-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION #5: Rastreamento de Promoções Relâmpago
-- ═══════════════════════════════════════════════════════════════════════════
-- Data: 23/03/2026
-- Objetivo: Adicionar suporte para promoções relâmpago
-- Status: PRONTO PARA EXECUTAR
-- ═══════════════════════════════════════════════════════════════════════════

-- EXECUTE ESTE COMANDO PRIMEIRO
-- Adicionar coluna para identificar tipo de mensagem (promocao, lembrete, motivacional)
ALTER TABLE cliente_mensagens_motivacionais
ADD COLUMN IF NOT EXISTS tipo_mensagem TEXT DEFAULT 'motivacional';

-- ═══════════════════════════════════════════════════════════════════════════

-- EXECUTE ESTE COMANDO SEGUNDO
-- Criar índice para buscar promoções rapidamente por cliente
CREATE INDEX IF NOT EXISTS idx_cliente_msg_tipo_msg
ON cliente_mensagens_motivacionais(cliente_id, tipo_mensagem);

-- ═══════════════════════════════════════════════════════════════════════════

-- EXECUTE ESTE COMANDO TERCEIRO
-- Criar índice para buscar promoções por data (mais recentes primeiro)
CREATE INDEX IF NOT EXISTS idx_msg_promo_data
ON cliente_mensagens_motivacionais(tipo_mensagem, created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICAÇÃO: Execute após todos os comandos acima para confirmar
-- ═══════════════════════════════════════════════════════════════════════════

-- Verificar se coluna foi criada
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name='cliente_mensagens_motivacionais'
AND column_name='tipo_mensagem';

-- Resultado esperado:
-- column_name    | data_type | column_default
-- ────────────── | ───────── | ──────────────
-- tipo_mensagem  | text      | 'motivacional'::text

-- ═══════════════════════════════════════════════════════════════════════════
-- FIM DA MIGRATION #5
-- ═══════════════════════════════════════════════════════════════════════════
