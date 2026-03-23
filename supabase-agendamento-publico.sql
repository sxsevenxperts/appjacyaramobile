-- Tabela para agendamentos públicos (sem login)
CREATE TABLE agendamentos_publicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  procedimento VARCHAR(255) NOT NULL,
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, confirmado, cancelado
  origem VARCHAR(50) DEFAULT 'chat', -- chat, link_publico
  criado_em TIMESTAMP DEFAULT NOW(),
  confirmado_em TIMESTAMP,
  token_confirmacao VARCHAR(255) UNIQUE,
  observacoes TEXT
);

-- Índices para melhor performance
CREATE INDEX idx_agendamentos_publicos_telefone ON agendamentos_publicos(cliente_telefone);
CREATE INDEX idx_agendamentos_publicos_data ON agendamentos_publicos(data_agendamento);
CREATE INDEX idx_agendamentos_publicos_status ON agendamentos_publicos(status);
CREATE INDEX idx_agendamentos_publicos_token ON agendamentos_publicos(token_confirmacao);

-- RLS (Row Level Security) - permitir inserts públicos, mas ler apenas com permissão
ALTER TABLE agendamentos_publicos ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer um pode inserir
CREATE POLICY "Permitir inserts públicos" ON agendamentos_publicos
  FOR INSERT WITH CHECK (true);

-- Policy: Apenas admin e staff podem ler
CREATE POLICY "Ler agendamentos públicos" ON agendamentos_publicos
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'recepcionista', 'profissional')
    )
  );

-- Policy: Ler por token (para confirmação via link)
CREATE POLICY "Ler por token confirmacao" ON agendamentos_publicos
  FOR SELECT USING (token_confirmacao IS NOT NULL);
