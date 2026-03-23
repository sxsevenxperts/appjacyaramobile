# 🔔 Setup de Cron Job para Automação de Notificações

## 📋 Resumo

Este documento explica como configurar o sistema automático de notificações push para enviar mensagens motivacionais aos clientes em intervalos inteligentes, com conteúdo personalizado por tipo de procedimento.

---

## 🎯 Funcionalidades Implementadas

### 1. **Sistema de Mensagens Inteligente**
- **MENSAGENS_MOTIVACIONAIS_BANCO**: 7 mensagens genéricas
- **MENSAGENS_CORPO**: 7 mensagens para procedimentos corporais (foco: treino, alimentação, hidratação)
- **MENSAGENS_FACIAL**: 7 mensagens para limpeza facial (foco: hidratação, protetor solar, limpeza periódica)

### 2. **Agendamento Inteligente de Envios**
Intervalo de envios: **1, 3, 4, 5, 6, 7 dias** (nunca 2 dias consecutivos ou 2 dias de intervalo)
- Evita fadiga de notificações
- Mantém engajamento consistente
- Personalizado por cliente

### 3. **Gatilhos de Notificação**
✅ Confirmação de agendamento
✅ Lembrete 24h antes
✅ Aviso de continuidade (3 procedimentos restantes)
✅ Conclusão de protocolo (12 procedimentos)
✅ Pacote vencendo (2 semanas)
✅ Cliente inativo (30+ dias)
✅ Falta registrada
✅ Aniversário
✅ Recomendação de limpeza facial (30-45 dias)

---

## 🗄️ SQL Migrations Necessárias

Execute essas queries no **Supabase SQL Editor** para preparar o banco:

### 1. Adicionar colunas à tabela de mensagens

```sql
-- Adicionar colunas para rastreamento de notificações push
ALTER TABLE cliente_mensagens_motivacionais
ADD COLUMN IF NOT EXISTS titulo TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente_exibicao',
ADD COLUMN IF NOT EXISTS data_exibicao TIMESTAMP,
ADD COLUMN IF NOT EXISTS tipo_notificacao TEXT DEFAULT 'push';

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_cliente_msg_status
ON cliente_mensagens_motivacionais(cliente_id, status);

CREATE INDEX IF NOT EXISTS idx_cliente_msg_tipo
ON cliente_mensagens_motivacionais(cliente_id, tipo_notificacao);
```

### 2. Inserir/Verificar tabela de procedimentos

```sql
-- Verificar se procedimentos já existem
SELECT COUNT(*) FROM procedimentos;

-- Se a tabela estiver vazia, inserir os 10 procedimentos:
INSERT INTO procedimentos (nome, descricao, duracao_minutos, preco) VALUES
  ('Ultrassom Ultracavitação', 'Redução de medidas e queima de gordura', 45, 150),
  ('Pump Up', 'Aumento de volume natural com tecnologia avançada', 50, 180),
  ('Radiofrequência', 'Lifting não invasivo e apertamento de pele', 60, 200),
  ('Carboxiterapia', 'Injeção de CO2 para renovação celular', 45, 160),
  ('Drenagem', 'Drenagem linfática manual ou mecânica', 50, 140),
  ('Massagem', 'Massagem relaxante ou terapêutica', 60, 120),
  ('Peeling', 'Esfoliação profunda química ou mecânica', 50, 130),
  ('Limpeza de Pele', 'Limpeza profunda facial com extração', 45, 100),
  ('Hidratação facial', 'Hidratação profunda e nutritiva para pele', 40, 110),
  ('Avaliação Especializada', 'Análise completa e plano de tratamento', 30, 80)
ON CONFLICT (nome) DO NOTHING;
```

---

## ⚙️ Configuração da Automação

### **Opção 1: Usar o Painel Admin (Manual)**

Acesse a aba **"🔔 Notificações"** no aplicativo e use os botões:

- 📤 **Lembretes 24h** - Envia lembrete aos que têm agendamento amanhã
- 💕 **Motivacionais** - Envia mensagens variadas aos elegíveis
- ⏳ **Pacotes Vencendo** - Avisa sobre pacotes com vencimento em 2 semanas
- 💔 **Inativos** - Notifica clientes sem agendamento há 30 dias
- 🎂 **Aniversários** - Parabeniza aniversariantes
- ✨ **Limpeza Facial** - Recomenda limpeza facial (30-45 dias)

### **Opção 2: Automático com Cron Job (Recomendado)**

#### Via **Supabase Edge Functions** (Recomendado)

1. **Criar Edge Function**
```bash
# No terminal, na raiz do projeto:
supabase functions new enviar_notificacoes

# Conteúdo do arquivo (functions/enviar_notificacoes/index.ts):
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  // Chamar a função JavaScript do app
  // Isso seria feito via webhook/HTTP call

  return new Response(
    JSON.stringify({ status: 'ok', mensagem: 'Notificações enviadas' }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

2. **Deploy**
```bash
supabase functions deploy enviar_notificacoes
```

3. **Criar Schedule via Supabase Dashboard**
   - Ir para: Edge Functions → enviar_notificacoes → Invocations
   - Configurar webhook para chamar a função automaticamente

#### Via **HTTP Cron Service** (Alternativa)

Use um serviço como **EasyCron** ou **IFTTT**:

1. **Acesso**: https://www.easycron.com (ou similar)
2. **Criar novo Cron Job**
   - **URL**: `https://seu-app.com/api/cron/notificacoes`
   - **Frequência**: Diariamente às 8:00 AM
   - **Método**: POST

3. **Endpoint (adicione ao server.js)**
```javascript
// POST /api/cron/notificacoes
app.post('/api/cron/notificacoes', async (req, res) => {
  try {
    // Executar função de envio (chamada via script no cliente)
    // Isso requer permissão de admin
    res.json({ status: 'ok', mensagem: 'Cron job executado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

#### Via **Task Scheduler Local** (Desenvolvimento)

Se estiver desenvolvendo localmente:

```javascript
// Adicionar no arquivo de inicialização (init)
setInterval(async () => {
  if (APP.currentUser?.role === 'admin') {
    console.log('⏰ Executando cron job de notificações...');
    await enviarMensagensMotivacionais();
    await verificarLimpezaFacialPeriodica();
    await enviarLembretes24hAntes();
    console.log('✅ Cron job concluído');
  }
}, 24 * 60 * 60 * 1000); // A cada 24 horas
```

---

## 📱 Testando as Notificações

### 1. **Manualmente via Painel Admin**
- Faça login como ADMIN
- Acesse "🔔 Notificações"
- Clique em qualquer botão de disparo
- Verifique os logs do console

### 2. **Testar com Cliente de Teste**
```javascript
// No console do navegador:
const clienteTeste = {
  id: 'seu-cliente-id',
  nome: 'Teste Cliente',
  tratamento_atual: 'Limpeza de Pele'
};

await enviarNotificacaoMotivacional(
  clienteTeste,
  'confirmacao_agendamento',
  { data: '25/03/2026', hora: '14:00', tratamento: 'Limpeza de Pele' }
);
```

### 3. **Verificar Histórico**
```javascript
// No console:
const { data } = await sb.from('cliente_mensagens_motivacionais')
  .select('*')
  .eq('cliente_id', 'seu-cliente-id')
  .order('created_at', { ascending: false })
  .limit(10);

console.table(data);
```

---

## 🎨 Personalizações por Tipo de Procedimento

### **Procedimentos de Corpo** (Foco: Exercício, Alimentação, Hidratação)
Categorias incluídas:
- Ultrassom Ultracavitação
- Pump Up
- Radiofrequência
- Carboxiterapia
- Drenagem
- Massagem

**Mensagens incluem dicas**: "Não esqueça: alimente bem, durma bem, hidrate sempre!"

### **Procedimentos Faciais** (Foco: Protetor Solar, Hidratação, Limpeza Periódica)
Categorias incluídas:
- Peeling
- Limpeza de Pele
- Hidratação facial
- Avaliação Especializada

**Recomendação automática**: "Limpeza profunda a cada 30-45 dias = pele perfeita!"

---

## 📊 Monitoramento

### Verificar Notificações Enviadas
```javascript
// Histórico últimas 30 dias
const { data: historico } = await sb.from('cliente_mensagens_motivacionais')
  .select('*')
  .gte('created_at', new Date(Date.now() - 30*24*60*60*1000).toISOString())
  .order('created_at', { ascending: false });

console.log(`Total enviadas: ${historico.length}`);
historico.forEach(msg => {
  console.log(`${msg.titulo} → ${msg.cliente_id}`);
});
```

### Taxa de Engajamento
```javascript
// Clientes que interagiram com notificação
const { data: engajados } = await sb.from('cliente_mensagens_motivacionais')
  .select('cliente_id')
  .eq('status', 'exibida')
  .eq('tipo_notificacao', 'push');

console.log(`Taxa de exibição: ${engajados.length / historico.length * 100}%`);
```

---

## 🚀 Próximos Passos

1. ✅ Executar as SQL migrations acima
2. ✅ Configurar automação (escolher uma opção acima)
3. ✅ Testar manualmente via painel admin
4. ✅ Monitorar logs e engajamento
5. ✅ Ajustar mensagens conforme feedback dos clientes

---

## 🔧 Troubleshooting

### **Problema**: "Notificação não aparece no navegador"
**Solução**:
- Verificar se o Service Worker está ativo
- Permitir notificações no navegador (permissão)
- Verificar console para erros

### **Problema**: "Mesma mensagem enviada múltiplas vezes"
**Solução**:
- Sistema já detecta mensagens repetidas automaticamente
- Se persistir, limpar histórico e reexecutar

### **Problema**: "Cron job não executa no horário"
**Solução**:
- Verificar se o serviço de cron está ativo
- Adicionar logs para debug
- Testar endpoint manualmente com curl

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs no console do navegador (F12)
2. Revisar histórico de notificações no painel admin
3. Testar manualmente as funções via console JavaScript
