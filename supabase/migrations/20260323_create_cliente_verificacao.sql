-- Tabela para rastrear verificação de clientes pela admin
CREATE TABLE IF NOT EXISTS cliente_verificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pendente', -- pendente, verificado, rejeitado
  motivo_rejeicao TEXT,
  verificado_por UUID REFERENCES auth.users(id),
  data_verificacao TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index para melhor performance
CREATE INDEX idx_cliente_verificacao_status ON cliente_verificacao(status);
CREATE INDEX idx_cliente_verificacao_cliente_id ON cliente_verificacao(cliente_id);

-- RLS Policies
ALTER TABLE cliente_verificacao ENABLE ROW LEVEL SECURITY;

-- Admin pode ver e gerenciar
CREATE POLICY admin_view_verificacao ON cliente_verificacao
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY admin_manage_verificacao ON cliente_verificacao
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY admin_insert_verificacao ON cliente_verificacao
  FOR INSERT WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Clientes podem ver seu próprio status
CREATE POLICY cliente_view_own_verificacao ON cliente_verificacao
  FOR SELECT USING (
    cliente_id = auth.uid()
  );

-- View para status de verificação de clientes
CREATE OR REPLACE VIEW cliente_verificacao_status AS
SELECT 
  c.id,
  c.nome,
  c.email,
  c.telefone,
  cv.status,
  cv.data_verificacao,
  cv.motivo_rejeicao,
  CASE 
    WHEN cv.status = 'verificado' THEN true 
    WHEN cv.status = 'pendente' THEN false
    WHEN cv.status = 'rejeitado' THEN false
    ELSE false 
  END as pode_agendar
FROM clientes c
LEFT JOIN cliente_verificacao cv ON c.id = cv.cliente_id
ORDER BY c.nome;