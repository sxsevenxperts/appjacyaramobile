-- Migration: Create cliente_referrals table for referral tracking
-- Date: 2026-03-23
-- Purpose: Track client referrals and allow clients to share clinic with friends

CREATE TABLE IF NOT EXISTS cliente_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_indicador_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  cliente_indicado_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  nome_indicado VARCHAR(255),
  telefone_indicado VARCHAR(20),
  email_indicado VARCHAR(255),
  token_referencia VARCHAR(255) UNIQUE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, cadastrada, concluido
  data_indicacao TIMESTAMP DEFAULT NOW(),
  data_cadastro TIMESTAMP,
  
  -- Reward (optional)
  desconto_percentual INT DEFAULT 10,
  desconto_aplicado BOOLEAN DEFAULT false,
  
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Create table for referral codes per client
CREATE TABLE IF NOT EXISTS cliente_codigo_referencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE UNIQUE,
  codigo_referencia VARCHAR(20) UNIQUE NOT NULL,
  link_referencia VARCHAR(512),
  total_indicacoes INT DEFAULT 0,
  total_cadastros INT DEFAULT 0,
  desconto_acumulado FLOAT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referral_indicador 
ON cliente_referrals(cliente_indicador_id);

CREATE INDEX IF NOT EXISTS idx_referral_indicado 
ON cliente_referrals(cliente_indicado_id);

CREATE INDEX IF NOT EXISTS idx_referral_token 
ON cliente_referrals(token_referencia);

CREATE INDEX IF NOT EXISTS idx_referral_status 
ON cliente_referrals(status);

CREATE INDEX IF NOT EXISTS idx_codigo_cliente_id 
ON cliente_codigo_referencia(cliente_id);

CREATE INDEX IF NOT EXISTS idx_codigo_referencia 
ON cliente_codigo_referencia(codigo_referencia);

-- Create view for referral statistics
CREATE OR REPLACE VIEW cliente_referral_stats AS
SELECT 
  ccr.cliente_id,
  c.nome,
  ccr.codigo_referencia,
  ccr.total_indicacoes,
  ccr.total_cadastros,
  ccr.desconto_acumulado,
  COUNT(CASE WHEN cr.status = 'pendente' THEN 1 END) as pendentes,
  COUNT(CASE WHEN cr.status = 'cadastrada' THEN 1 END) as cadastradas,
  COUNT(CASE WHEN cr.status = 'concluido' THEN 1 END) as completas
FROM cliente_codigo_referencia ccr
LEFT JOIN clientes c ON ccr.cliente_id = c.id
LEFT JOIN cliente_referrals cr ON ccr.cliente_id = cr.cliente_indicador_id
GROUP BY ccr.cliente_id, c.nome, ccr.codigo_referencia, 
         ccr.total_indicacoes, ccr.total_cadastros, ccr.desconto_acumulado;

-- Enable RLS
ALTER TABLE cliente_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_codigo_referencia ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "authenticated_can_view_referrals" 
ON cliente_referrals FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_insert_referrals" 
ON cliente_referrals FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_view_codigo" 
ON cliente_codigo_referencia FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_insert_codigo" 
ON cliente_codigo_referencia FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_update_codigo" 
ON cliente_codigo_referencia FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
