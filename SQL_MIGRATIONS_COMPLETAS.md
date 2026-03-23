# 🗄️ SQL Migrations Completas - Executar em Sequência

Execute estas queries **uma por uma** no Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new)

---

## 1️⃣ CRIAR TABELA DE MENSAGENS MOTIVACIONAIS

```sql
-- Criar tabela principal de mensagens motivacionais
CREATE TABLE IF NOT EXISTS cliente_mensagens_motivacionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  titulo TEXT,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'pendente_exibicao',
  data_exibicao TIMESTAMP,
  tipo_notificacao TEXT DEFAULT 'push',
  proxima_mensagem_em DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_cliente_msg_cliente
ON cliente_mensagens_motivacionais(cliente_id);

CREATE INDEX IF NOT EXISTS idx_cliente_msg_status
ON cliente_mensagens_motivacionais(cliente_id, status);

CREATE INDEX IF NOT EXISTS idx_cliente_msg_tipo
ON cliente_mensagens_motivacionais(cliente_id, tipo_notificacao);

CREATE INDEX IF NOT EXISTS idx_cliente_msg_proxima
ON cliente_mensagens_motivacionais(cliente_id, proxima_mensagem_em);
```

**Status**: Execute isto primeiro ✅

---

## 2️⃣ TABELA DE PROCEDIMENTOS (se não existir)

```sql
-- Criar tabela de procedimentos (se não existir)
CREATE TABLE IF NOT EXISTS procedimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  duracao_minutos INTEGER,
  preco DECIMAL(10,2),
  categoria TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir procedimentos da clínica
INSERT INTO procedimentos (nome, descricao, duracao_minutos, preco, categoria)
VALUES
  ('Ultrassom Ultracavitação', 'Redução de medidas e queima de gordura', 45, 150, 'corpo'),
  ('Pump Up', 'Aumento de volume natural com tecnologia avançada', 50, 180, 'corpo'),
  ('Radiofrequência', 'Lifting não invasivo e apertamento de pele', 60, 200, 'corpo'),
  ('Carboxiterapia', 'Injeção de CO2 para renovação celular', 45, 160, 'corpo'),
  ('Drenagem', 'Drenagem linfática manual ou mecânica', 50, 140, 'corpo'),
  ('Massagem', 'Massagem relaxante ou terapêutica', 60, 120, 'corpo'),
  ('Peeling', 'Esfoliação profunda química ou mecânica', 50, 130, 'facial'),
  ('Limpeza de Pele', 'Limpeza profunda facial com extração', 45, 100, 'facial'),
  ('Hidratação facial', 'Hidratação profunda e nutritiva para pele', 40, 110, 'facial'),
  ('Avaliação Especializada', 'Análise completa e plano de tratamento', 30, 80, 'facial')
ON CONFLICT (nome) DO NOTHING;
```

**Status**: Execute isto segundo ✅

---

## 3️⃣ ADICIONAR COLUNA DE DATA DE NASCIMENTO (se não existir)

```sql
-- Adicionar coluna de data de nascimento à tabela clientes (se não existir)
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS data_nascimento DATE;

-- Adicionar coluna de status ativo/inativo (se não existir)
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Adicionar coluna de último agendamento (para tracking de inatividade)
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS ultimo_agendamento DATE;

-- Criar índice para buscar por data de nascimento (para aniversários)
CREATE INDEX IF NOT EXISTS idx_clientes_data_nascimento
ON clientes(data_nascimento);
```

**Status**: Execute isto terceiro ✅

---

## 4️⃣ ATUALIZAR TABELA DE AGENDAMENTOS (se necessário)

```sql
-- Adicionar colunas ausentes em agendamentos
ALTER TABLE agendamentos
ADD COLUMN IF NOT EXISTS procedimento_nome TEXT,
ADD COLUMN IF NOT EXISTS hora_agendamento TIME,
ADD COLUMN IF NOT EXISTS data_agendamento DATE;

-- Criar índices de performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_status
ON agendamentos(status);

CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente
ON agendamentos(cliente_id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_data
ON agendamentos(data_horario);
```

**Status**: Execute isto quarto ✅

---

## 🎯 RESUMO FINAL

| Migration | Status |
|-----------|--------|
| 1. Criar tabela mensagens | ✅ **Fazer primeiro** |
| 2. Criar tabela procedimentos | ✅ **Fazer segundo** |
| 3. Adicionar colunas clientes | ✅ **Fazer terceiro** |
| 4. Atualizar agendamentos | ✅ **Fazer quarto** |

---

## ⚠️ IMPORTANTE

- Execute **uma query por vez**
- Espere a resposta de sucesso antes de passar para a próxima
- Se receber erro de "já existe", não há problema - está indicado `IF NOT EXISTS`
- Após completar, as notificações funcionarão 100%

---

## ✅ Como Saber que Funcionou?

Após executar tudo, rode esta query para verificar:

```sql
-- Verificar se tudo foi criado corretamente
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('cliente_mensagens_motivacionais', 'procedimentos')
ORDER BY table_name;
```

Deve retornar 2 linhas:
- `cliente_mensagens_motivacionais`
- `procedimentos`

Se retornar as 2, **tudo está pronto!** 🎉
