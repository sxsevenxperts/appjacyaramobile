-- Migration: Create tables for tracking no-shows and motivational messages
-- Date: 2026-03-23
-- Purpose: Track client no-shows, missed appointments, and send motivational messages

-- Table to track no-shows and cancellations
CREATE TABLE IF NOT EXISTS cliente_faltas_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  agendamento_id UUID REFERENCES agendamentos(id),
  tipo VARCHAR(50), -- 'faltou', 'cancelou', 'remarcou'
  data_falta DATE DEFAULT CURRENT_DATE,
  motivo TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Table to track motivational messages sent
CREATE TABLE IF NOT EXISTS cliente_mensagens_motivacionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo VARCHAR(50), -- 'volta_ao_agendamento', 'continuidade_tratamento', 'avaliacao_nova'
  mensagem TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'enviada', -- 'enviada', 'lida', 'falha'
  data_envio TIMESTAMP DEFAULT NOW(),
  proxima_mensagem_em DATE,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- View: Calculate client statistics
CREATE OR REPLACE VIEW cliente_estatisticas AS
SELECT 
  c.id,
  c.nome,
  c.telefone,
  c.tratamento,
  COUNT(CASE WHEN f.tipo = 'faltou' THEN 1 END) as total_faltas,
  COUNT(CASE WHEN f.tipo = 'cancelou' THEN 1 END) as total_cancelamentos,
  MAX(CASE WHEN f.tipo = 'faltou' THEN f.data_falta END) as ultima_falta,
  (
    SELECT COUNT(*) FROM agendamentos a 
    WHERE a.cliente_id = c.id 
    AND a.status = 'agendado'
    AND a.data_agendamento >= CURRENT_DATE
  ) as agendamentos_proximos,
  (
    SELECT COUNT(*) FROM agendamentos a 
    WHERE a.cliente_id = c.id 
    AND a.status = 'concluido'
  ) as procedimentos_concluidos
FROM clientes c
LEFT JOIN cliente_faltas_historico f ON c.id = f.cliente_id
GROUP BY c.id, c.nome, c.telefone, c.tratamento;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cliente_faltas_cliente_id 
ON cliente_faltas_historico(cliente_id);

CREATE INDEX IF NOT EXISTS idx_cliente_faltas_data 
ON cliente_faltas_historico(data_falta DESC);

CREATE INDEX IF NOT EXISTS idx_mensagens_cliente_id 
ON cliente_mensagens_motivacionais(cliente_id);

CREATE INDEX IF NOT EXISTS idx_mensagens_data_envio 
ON cliente_mensagens_motivacionais(data_envio DESC);

CREATE INDEX IF NOT EXISTS idx_mensagens_proxima 
ON cliente_mensagens_motivacionais(proxima_mensagem_em);

-- Enable RLS
ALTER TABLE cliente_faltas_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_mensagens_motivacionais ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "authenticated_can_view_faltas" 
ON cliente_faltas_historico FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_insert_faltas" 
ON cliente_faltas_historico FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_view_mensagens" 
ON cliente_mensagens_motivacionais FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_insert_mensagens" 
ON cliente_mensagens_motivacionais FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_update_mensagens" 
ON cliente_mensagens_motivacionais FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
