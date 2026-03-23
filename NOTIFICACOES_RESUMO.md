# 📲 Sistema de Notificações Push - Resumo Executivo

## ✅ O Que Foi Implementado

### 1. **Sistema de Mensagens Inteligente**

#### Mensagens Motivacionais (Não-Repetitivas)
- **7 mensagens para Corpo** (foco em: treino, alimentação, hidratação)
- **7 mensagens para Facial** (foco em: protetor solar, hidratação, limpeza periódica)
- **7 mensagens genéricas** (funcionam para todos)
- **Total**: 21 mensagens únicas que rotacionam automaticamente

**Exemplo de Mensagem Corpo**:
```
🌊 Hidratação = Resultados
{NOME}, beba 3L de água por dia e volte com {TRATAMENTO}!
A pele e o corpo pedem continuidade! 💧
```

**Exemplo de Mensagem Facial**:
```
☀️ Protetor solar é essencial!
Para manter seus resultados com {TRATAMENTO}, use FPS 50+ diariamente.
Hidratar + proteger = beleza durável! 💧
```

### 2. **Agendamento Inteligente**

Intervalo de envios: **1, 3, 4, 5, 6, 7 dias**
- Nunca envia em dias consecutivos
- Nunca usa intervalo de 2 dias
- Mantém engajamento sem fadiga

```javascript
// Sequência automática:
Dia 0 (envio) → Dia 1 (aguardando) → Dia 3 (próximo) → Dia 4 → Dia 5 → Dia 6 → Dia 7 → reinicia
```

### 3. **Notificações de Lembrete** (8 tipos)

| Tipo | Trigger | Exemplo |
|------|---------|---------|
| ✅ **Confirmação** | Agendamento confirmado | "Seu agendamento de Limpeza está confirmado para 25/03 às 14:00" |
| 🔔 **Lembrete 24h** | 1 dia antes | "Seu agendamento é amanhã às 14:00. Chegue 5 min antes!" |
| ⚠️ **Continuidade** | 3 procedimentos faltando | "Faltam 3 para completar! Continuidade = Resultados!" |
| 🎉 **Conclusão** | 12 procedimentos completos | "Parabéns! Protocolo completo! Agende avaliação de progresso!" |
| ⏳ **Pacote Vencendo** | 2 semanas antes de vencer | "Seu pacote vence em 2 semanas! Use suas {N} sessões!" |
| 💔 **Cliente Inativo** | 30+ dias sem agendamento | "Você não nos visita há 30 dias. Seus resultados podem regredir!" |
| ⚠️ **Falta Registrada** | Falta confirmada | "Você faltou. Marque nova data para manter resultados!" |
| 🎂 **Aniversário** | Dia de aniversário | "Feliz Aniversário! 20% OFF em qualquer procedimento!" |

### 4. **Recomendação Automática**

✨ **Limpeza Facial Periódica**
- Verifica quando foi última limpeza
- Recomenda quando passar de 35 dias
- Ideal: a cada 30-45 dias

```
✨ Hora da Limpeza Facial!
{NOME}, já faz {DIAS} dias desde sua última limpeza profunda.
O ideal é fazer a cada 30-45 dias! Reserve seu lugar agora! 🧖‍♀️
```

---

## 🎯 Fluxos de Integração

### **Fluxo 1: Criar Agendamento via Chat**
```
Cliente no Chat → Digita nome e telefone
    ↓
Sistema valida na DB
    ↓
Cria agendamento (se cliente verificado)
    ↓
Envia Push: "✅ Agendamento Confirmado!"
```

### **Fluxo 2: Confirmar Agendamento (Admin)**
```
Admin clica "Confirmar" no agendamento
    ↓
Status muda para "confirmado"
    ↓
Envia Push: "✅ Agendamento Confirmado!"
    ↓
Agenda próximo lembrete para 24h antes
```

### **Fluxo 3: Concluir Agendamento (Atendimento)**
```
Admin marca como "concluído"
    ↓
Verifica progresso do cliente:
    - Se 9 concluídos → "⚠️ Faltam 3!"
    - Se 12 concluídos → "🎉 Protocolo Completo!"
    ↓
Abre modal de avaliação do atendimento
    ↓
Registra satisfação do cliente
```

---

## 🔧 Como Usar o Admin Panel

### **Painel de Notificações** (Abas → Notificações)

#### Botões Disponíveis

1️⃣ **📤 Lembretes 24h**
   - Envia lembrete a clientes com agendamento amanhã
   - Texto: "Seu agendamento é amanhã às {HORA}!"

2️⃣ **💕 Motivacionais**
   - Envia mensagem variada a clientes elegíveis
   - Seleciona automaticamente tipo (corpo/facial)
   - Nunca repete a mesma para o cliente

3️⃣ **⏳ Pacotes Vencendo**
   - Avisa sobre pacotes com vencimento em 2 semanas
   - Mostra sessões restantes

4️⃣ **💔 Inativos**
   - Notifica clientes sem agendamento há 30 dias
   - Incentiva retorno

5️⃣ **🎂 Aniversários**
   - Parabeniza clientes nascidos hoje
   - Oferece 20% OFF

6️⃣ **✨ Limpeza Facial**
   - Recomenda limpeza profunda (30-45 dias)
   - Personalizado por cliente

#### Histórico de Notificações
- Mostra últimas 20 notificações enviadas
- Data de envio
- Cliente e conteúdo
- Status (pendente, enviada, exibida)

---

## 📊 Detecção Automática de Tipo

O sistema detecta automaticamente:

### **Procedimentos de CORPO**
```
- Ultrassom Ultracavitação
- Pump Up
- Radiofrequência
- Carboxiterapia
- Drenagem
- Massagem
```
→ Mensagens focam em: **treino + alimentação + hidratação**

### **Procedimentos FACIAL**
```
- Peeling
- Limpeza de Pele
- Hidratação facial
- Avaliação Especializada
```
→ Mensagens focam em: **protetor solar + hidratação + limpeza periódica**

---

## 🚀 Automatização (Cron Job)

### Setup Recomendado

**Frequência**: 1x por dia (idealmente 8:00 AM)

```javascript
// Executa todos os dias:
async function cronJobDiario() {
  await enviarMensagensMotivacionais();  // Principais
  await enviarLembretes24hAntes();       // Lembretes de amanhã
  await verificarPacotesVencendo();      // 2 semanas
  await verificarClientesInativos(30);   // 30 dias
  await verificarLimpezaFacialPeriodica(); // 30-45 dias
  await verificarAniversarios();         // Aniversariantes
}
```

### Veja: `CRON_JOB_SETUP.md` para configuração completa

---

## 📱 Placeholders Disponíveis

Todas as mensagens suportam substituição automática:

```
{NOME}                    → Nome do cliente
{TRATAMENTO}              → Procedimento realizado
{DATA}                    → Data do agendamento (25/03/2026)
{HORA}                    → Hora do agendamento (14:00)
{SESSOES_RESTANTES}       → Número de sessões do pacote
{PACOTE}                  → Nome do pacote
{DIAS}                    → Dias desde última visita
```

---

## 💾 Banco de Dados

### Tabela: `cliente_mensagens_motivacionais`

Novas colunas (via migration):
```sql
- titulo TEXT               -- Título da notificação
- status TEXT               -- pendente_exibicao | exibida | descartada
- data_exibicao TIMESTAMP   -- Quando foi mostrada
- tipo_notificacao TEXT     -- push | whatsapp | email
- proxima_mensagem_em DATE  -- Próximo agendamento
```

Índices adicionados:
```sql
- idx_cliente_msg_status(cliente_id, status)
- idx_cliente_msg_tipo(cliente_id, tipo_notificacao)
```

---

## 🔍 Monitorando

### Ver Notificações Enviadas (Console)

```javascript
// Últimas 30 dias
const { data } = await sb.from('cliente_mensagens_motivacionais')
  .select('*')
  .gte('created_at', new Date(Date.now() - 30*24*60*60*1000).toISOString())
  .order('created_at', { ascending: false });

console.table(data);
```

### Taxa de Engajamento

```javascript
// % de notificações exibidas
const exibidas = data.filter(d => d.status === 'exibida').length;
const taxa = (exibidas / data.length * 100).toFixed(1);
console.log(`Taxa de exibição: ${taxa}%`);
```

---

## 🎨 Customização

### Adicionar Nova Mensagem Motivacional

```javascript
const MENSAGENS_CORPO = [
  // ... existentes ...
  {
    title: "🏋️ Seu Poder",
    body: "{NOME}, cada sessão de {TRATAMENTO} torna você mais forte! 💪"
  }
];
```

### Adicionar Novo Gatilho

```javascript
async function meusGatilho() {
  const { data: clientes } = await sb.from('clientes')
    .select('*')
    .eq('minha_condicao', true);

  for (const cliente of clientes) {
    const msg = {
      title: "Meu Gatilho",
      body: "Conteúdo personalizado"
    };
    await enviarNotificacao(cliente, msg, 'gatilho_customizado');
  }
}
```

---

## ✨ Destaques Técnicos

- ✅ **Zero repetição**: Sistema rastreia mensagens já enviadas
- ✅ **Inteligente**: Detecta tipo de procedimento automaticamente
- ✅ **Flexível**: Intervalos não-lineares (1,3,4,5,6,7 dias)
- ✅ **Escalável**: Suporta até 50 clientes por ciclo
- ✅ **Rastreável**: Histórico completo com status
- ✅ **Manual + Automático**: Panel admin + Cron Job

---

## 📞 Próximas Etapas

1. ✅ Executar SQL migrations (veja: CRON_JOB_SETUP.md)
2. ✅ Testar via admin panel (Notificações)
3. ✅ Configurar cron job (1x/dia)
4. ✅ Monitorar engajamento
5. ✅ Ajustar mensagens conforme feedback

---

**Versão**: 1.0
**Data**: 23/03/2026
**Status**: ✅ Pronto para produção
