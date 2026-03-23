-- Migration: Create avaliacao_atendimento table for post-procedure feedback
-- Date: 2026-03-23
-- Purpose: Collect client feedback and satisfaction after each procedure

CREATE TABLE IF NOT EXISTS avaliacao_atendimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id UUID NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  profissional_id UUID REFERENCES profiles(id),
  
  -- Ratings (1-5 scale)
  avaliacao_geral INT CHECK (avaliacao_geral >= 1 AND avaliacao_geral <= 5),
  atendimento INT CHECK (atendimento >= 1 AND atendimento <= 5),
  resultado INT CHECK (resultado >= 1 AND resultado <= 5),
  ambiente INT CHECK (ambiente >= 1 AND ambiente <= 5),
  profissionalismo INT CHECK (profissionalismo >= 1 AND profissionalismo <= 5),
  
  -- Feedback
  observacoes TEXT,
  recomendaria BOOLEAN DEFAULT true,
  voltaria BOOLEAN DEFAULT true,
  
  -- Metadata
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_avaliacao_agendamento_id 
ON avaliacao_atendimento(agendamento_id);

CREATE INDEX IF NOT EXISTS idx_avaliacao_cliente_id 
ON avaliacao_atendimento(cliente_id);

CREATE INDEX IF NOT EXISTS idx_avaliacao_profissional_id 
ON avaliacao_atendimento(profissional_id);

CREATE INDEX IF NOT EXISTS idx_avaliacao_geral 
ON avaliacao_atendimento(avaliacao_geral);

CREATE INDEX IF NOT EXISTS idx_avaliacao_data 
ON avaliacao_atendimento(criado_em DESC);

-- Create view for statistics
CREATE OR REPLACE VIEW avaliacao_estatisticas AS
SELECT 
  COUNT(*) as total_avaliacoes,
  ROUND(AVG(avaliacao_geral)::numeric, 2) as media_geral,
  ROUND(AVG(atendimento)::numeric, 2) as media_atendimento,
  ROUND(AVG(resultado)::numeric, 2) as media_resultado,
  ROUND(AVG(ambiente)::numeric, 2) as media_ambiente,
  ROUND(AVG(profissionalismo)::numeric, 2) as media_profissionalismo,
  COUNT(CASE WHEN recomendaria = true THEN 1 END) as recomendariam,
  COUNT(CASE WHEN voltaria = true THEN 1 END) as voltariam,
  COUNT(CASE WHEN avaliacao_geral >= 4 THEN 1 END) as avaliacoes_positivas,
  COUNT(CASE WHEN avaliacao_geral <= 2 THEN 1 END) as avaliacoes_negativas
FROM avaliacao_atendimento;

-- Create view for professional statistics
CREATE OR REPLACE VIEW avaliacao_profissional_stats AS
SELECT 
  p.id,
  p.nome,
  COUNT(a.id) as total_avaliacoes,
  ROUND(AVG(a.avaliacao_geral)::numeric, 2) as media_geral,
  ROUND(AVG(a.atendimento)::numeric, 2) as media_atendimento,
  ROUND(AVG(a.resultado)::numeric, 2) as media_resultado,
  COUNT(CASE WHEN a.recomendaria = true THEN 1 END) as recomendariam,
  COUNT(CASE WHEN a.voltaria = true THEN 1 END) as voltariam
FROM profiles p
LEFT JOIN avaliacao_atendimento a ON p.id = a.profissional_id
GROUP BY p.id, p.nome;

-- Enable RLS
ALTER TABLE avaliacao_atendimento ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "authenticated_can_view_avaliacoes" 
ON avaliacao_atendimento FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_insert_avaliacoes" 
ON avaliacao_atendimento FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_update_avaliacoes" 
ON avaliacao_atendimento FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
