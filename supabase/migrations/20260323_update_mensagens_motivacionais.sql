-- Atualizar tabela de mensagens motivacionais para suportar Push Notifications
ALTER TABLE cliente_mensagens_motivacionais 
ADD COLUMN IF NOT EXISTS titulo TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente_exibicao', -- pendente_exibicao, exibida, descartada
ADD COLUMN IF NOT EXISTS data_exibicao TIMESTAMP,
ADD COLUMN IF NOT EXISTS tipo_notificacao TEXT DEFAULT 'push'; -- push, whatsapp, email

-- Criar índice para melhor performance nas buscas de notificações pendentes
CREATE INDEX IF NOT EXISTS idx_notificacoes_pendentes 
ON cliente_mensagens_motivacionais(cliente_id, status) 
WHERE status = 'pendente_exibicao';

-- Atualizar comentário da tabela
COMMENT ON TABLE cliente_mensagens_motivacionais IS 'Registro de mensagens motivacionais enviadas às clientes via push notifications';
COMMENT ON COLUMN cliente_mensagens_motivacionais.titulo IS 'Título da notificação push';
COMMENT ON COLUMN cliente_mensagens_motivacionais.status IS 'Status da notificação: pendente_exibicao, exibida, descartada';
COMMENT ON COLUMN cliente_mensagens_motivacionais.data_exibicao IS 'Data/hora em que a notificação foi exibida ao cliente';
COMMENT ON COLUMN cliente_mensagens_motivacionais.tipo_notificacao IS 'Tipo de notificação: push (recomendado), whatsapp (legado), email';