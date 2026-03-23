-- Inserir procedimentos da clínica estética
INSERT INTO procedimentos (nome, duracao_minutos, preco_base, descricao) VALUES
(
  'Ultrassom Ultracavitação',
  45,
  150.00,
  'Tratamento não-invasivo que utiliza ultrassom para eliminar gordura localizada através de cavitação. Ideal para redução de medidas e definição de contornos corporais.'
),
(
  'Pump Up',
  50,
  180.00,
  'Procedimento inovador de aumento de glúteos sem cirurgia, utilizando tecnologia de radiofrequência e vácuo. Resultados visíveis em poucas sessões.'
),
(
  'Radiofrequência',
  60,
  200.00,
  'Tratamento para flacidez e rejuvenescimento de pele utilizando energia de radiofrequência. Estimula colágeno e melhora elasticidade. Pode ser corporal ou facial.'
),
(
  'Carboxiterapia',
  45,
  160.00,
  'Injeção de dióxido de carbono medicinal para melhorar circulação, reduzir flacidez e gordura localizada. Excelente para celulite e envelhecimento.'
),
(
  'Drenagem',
  50,
  140.00,
  'Massagem drenante especializada que elimina retenção de líquidos, reduz inchaço e promove detoxificação do corpo. Relaxante e terapêutica.'
),
(
  'Massagem',
  60,
  120.00,
  'Massagem relaxante e terapêutica para aliviar tensão, melhorar circulação e bem-estar geral. Diferentes técnicas disponíveis.'
),
(
  'Peeling',
  50,
  130.00,
  'Esfoliação química ou física da pele para remover células mortas, melhorar textura e reduzir manchas. Deixa pele mais luminosa e renovada.'
),
(
  'Limpeza de Pele',
  45,
  100.00,
  'Limpeza profunda com higienização, esfoliação suave e extração de cravos. Ideal para preparar pele para outros tratamentos.'
),
(
  'Hidratação Facial',
  40,
  110.00,
  'Tratamento intensivo de hidratação da pele do rosto. Recompõe a umidade, deixa pele macia, brilhante e revitalizada.'
),
(
  'Avaliação Especializada',
  30,
  80.00,
  'Consulta profissional com especialista em estética para avaliação completa de pele, corpo e recomendação de tratamentos personalizados.'
);

-- Criar índice para melhor performance nas buscas de procedimentos
CREATE INDEX IF NOT EXISTS idx_procedimentos_nome ON procedimentos(nome);