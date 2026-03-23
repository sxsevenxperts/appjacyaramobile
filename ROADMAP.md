# 🚀 Roadmap - Easy Schedule - Clínica Estética Jacyara Ponte

## 📋 Funcionalidades a Implementar

### **FASE 1 - URGENTE (Próximas 2 semanas)**

#### 1️⃣ **Chat Interno com Agendamento Automático** ⭐
**Prioridade: ALTA** | **Complexidade: MÉDIA**

```
Fluxo:
- Cliente entra em "Chat" → Conversa com bot/recepcionista
- Digita: "Quero agendar Botox"
- Bot pede: "Qual seu nome completo?"
- Bot pede: "Qual seu telefone?"
- Bot pede: "Qual data/hora prefere?"
- Bot confirma e cria agendamento automaticamente
- Agendamento aparece no Dashboard
```

**Tabelas Banco:**
- `chat_mensagens` (id, user_id, texto, tipo:cliente/bot, criado_em)
- `chat_sessoes` (id, user_id, agendamento_id, status, criado_em)

**Frontend:**
- Nova página "Chat" com interface de conversa
- Bot com lógica de perguntas progressivas
- Integração com agendamentos

---

#### 2️⃣ **Acesso por Perfil + Link Público de Agendamento** ⭐
**Prioridade: ALTA** | **Complexidade: MÉDIA-ALTA**

```
Permissões:
- ADMIN: Controla TUDO
- PROFISSIONAL: Vê seu calendário, seus agendamentos, seus clientes
- RECEPCIONISTA: Agenda clientes, vê todos os agendamentos
- CLIENTE (sem login): Acessa via link → Vê horários disponíveis → Agenda
```

**Link Público:**
```
https://diversos-jacyaraapp.yuhqmc.easypanel.host/agendar/publico
- Não vê nomes de outros clientes
- Vê horários livres em tempo real
- Escolhe procedimento → Data → Hora
- Preenche nome + telefone
- Confirma → Recebe link para ver seu agendamento
```

**Banco:**
- `role_permissoes` (role, modulo, acao)
- `link_agendamento_publico` (id, token_unico, cliente_nome, cliente_tel, agendamento_id)

---

#### 3️⃣ **Horários e Dias de Funcionamento**
**Prioridade: ALTA** | **Complexidade: BAIXA**

```
Configurações:
- Seg-Sex: 09:00 - 18:00
- Sábado: 09:00 - 13:00
- Domingo: FECHADO
- Dias feriados personalizados
- Horário de pausa (ex: 12:00-13:00)
```

**Banco:**
- `config_horarios` (dia_semana, hora_abertura, hora_fechamento, ativo)
- `config_dias_fechados` (data, motivo)

---

### **FASE 2 - IMPORTANTE (Semanas 3-4)**

#### 4️⃣ **Pacotes de Sessões Melhorado**
**Prioridade: ALTA** | **Complexidade: MÉDIA**

```
Controle:
- Pacote: "5 Sessões de Botox" = R$ 1.500
- Cliente compra → Recebe 5 créditos
- Cada agendamento usa 1 crédito
- Validade: 3 meses (ex: 15/mar → 15/jun)
- Aviso automático: 2 semanas antes de vencer
- Opção renovação automática (opcional)
```

**Tabelas:**
- `pacotes` (id, nome, descricao, num_sessoes, preco, duracao_dias)
- `pacotes_cliente` (id, cliente_id, pacote_id, sessoes_usadas, vencimento, auto_renovar)

**Features:**
- Dashboard mostra pacotes vencendo
- Notificação 2 semanas antes
- Histórico de renovações

---

#### 5️⃣ **Gestão de Profissionais Completa**
**Prioridade: ALTA** | **Complexidade: MÉDIA-ALTA**

```
Dados Profissional:
- Nome completo
- Especialidades (Botox, Peeling, etc)
- Horários disponíveis
- Comissão por procedimento (%)
- Status (ativo/inativo)

Desempenho:
- Total atendimentos (mês/ano)
- Faturamento gerado
- Taxa de cancelamento
- Avaliação média (⭐⭐⭐⭐⭐)
```

**Tabelas:**
- `profissionais` (id, nome, especialidades, comissao_padrao)
- `profissional_horarios` (id, profissional_id, dia_semana, hora_inicio, hora_fim)
- `profissional_desempenho` (id, profissional_id, mes, atendimentos, faturamento, cancelamentos)

---

#### 6️⃣ **Dashboard Executivo com KPIs**
**Prioridade: ALTA** | **Complexidade: MEDIA**

```
Métricas:
📈 Receita do Mês (R$)
📊 Total Agendamentos (mês)
⏱️ Taxa de Ocupação (%)
💰 Ticket Médio (R$)
❌ Taxa de Cancelamento (%)
🏆 Top 5 Clientes (gastam mais)
⚠️ Alertas:
  - Pacotes vencendo
  - Procedimentos faltando prazo
  - Clientes inativos
```

**Gráficos:**
- Faturamento por mês (últimos 12 meses)
- Agendamentos vs Cancelamentos
- Receita por procedimento
- Receita por profissional

---

### **FASE 3 - IMPORTANTE (Semanas 5-6)**

#### 7️⃣ **Relatórios Avançados**
**Prioridade: MÉDIA-ALTA** | **Complexidade: MÉDIA**

```
Relatórios:
1. Faturamento por Procedimento
   - Procedimento → Quantidade → Faturamento → %

2. Top 5 Clientes (mais gastam)
   - Cliente → Total Gasto → Agendamentos → Status

3. Taxa de Cancelamento/Faltas
   - Ranking de clientes que mais faltam
   - Data, procedimento, motivo

4. Agendamentos por Profissional
   - Profissional → Agendamentos → Faturamento → Cancelamentos

5. Pacotes Vencidos/Vencendo
   - Cliente → Pacote → Vencimento → Status

6. Fluxo de Caixa
   - Receitas + Despesas (configurável)
```

**Export:**
- PDF (para impressão)
- Excel (para análise)
- Gráficos editáveis

---

#### 8️⃣ **Push Notifications (Lembretes)**
**Prioridade: MÉDIA** | **Complexidade: MÉDIA-ALTA**

```
Notificações Automáticas:
✅ 24h antes do agendamento
   → "Sua sessão é amanhã às 14:00"

✅ Pacote vencendo em 2 semanas
   → "Seu pacote vence em 14 dias"

✅ Cancelamento/Reagendamento
   → "Seu agendamento foi cancelado"

✅ Novo agendamento confirmado
   → "Agendamento criado para 20/mar 15:00"

✅ Aviso de falta
   → "Você faltou em seu agendamento"
```

**Implementação:**
- Service Worker + Web Push API
- Firebase Cloud Messaging (ou alternativa)
- Cron job para disparar notificações

---

### **FASE 4 - DESEJÁVEL (Semanas 7-8)**

#### 9️⃣ **Pagamentos Integrados**
**Prioridade: MÉDIA** | **Complexidade: ALTA**

```
Gateway de Pagamento:
- Stripe OU Mercado Pago
- Cartão de crédito
- Débito
- Pix (Mercado Pago)
- Parcelamento 1-12x (automático)

Fluxo:
1. Cliente escolhe procedimento → R$ 150
2. Clica "Pagar Agora"
3. Vai para tela de pagamento
4. Escolhe parcelamento (ex: 3x R$ 50)
5. Paga com cartão
6. Recebe comprovante por email
7. Agendamento confirmado automaticamente

Recibos:
- PDF por email
- Histórico no app
```

**Banco:**
- `pagamentos` (id, cliente_id, agendamento_id, valor, status, gateway, parcelas)
- `recibos` (id, pagamento_id, numero, data, pdf_url)

---

#### 🔟 **Email Marketing & Campanhas**
**Prioridade: BAIXA** | **Complexidade: MÉDIA**

```
Campanhas:
- Clientes inativos (não agendaram em 3 meses)
  → "Sentimos sua falta! Tem 20% OFF na próxima sessão"

- Aniversariantes
  → "Feliz aniversário! Ganhe R$ 50 em desconto"

- Pacote vencendo
  → "Seu pacote vence em 7 dias. Renove agora!"

- Procedimento vencendo
  → "Sua validade de Botox vence em 14 dias"

Template:
- Editor drag-and-drop
- Presets (aniversário, inativo, etc)
- Agendamento automático de envio
```

---

## 📊 Tabelas Necessárias (Supabase)

```sql
-- Já existem:
- profiles
- config_clinica
- v_agendamentos
- clientes
- agendamentos
- pacotes_cliente

-- Novas:
- chat_mensagens
- chat_sessoes
- role_permissoes
- config_horarios
- config_dias_fechados
- profissionais
- profissional_horarios
- profissional_desempenho
- pagamentos
- recibos
- campanhas_email
- campanhas_envios
```

---

## 🎯 Ordem Recomendada

### **Semana 1-2: PHASE 1**
1. ✅ Acesso por Perfil + Link Público
2. ✅ Chat com Agendamento Automático
3. ✅ Horários de Funcionamento

### **Semana 3-4: PHASE 2**
4. ✅ Pacotes Melhorados
5. ✅ Gestão de Profissionais
6. ✅ Dashboard Executivo

### **Semana 5-6: PHASE 3**
7. ✅ Relatórios Avançados
8. ✅ Push Notifications

### **Semana 7-8: PHASE 4**
9. ✅ Pagamentos Integrados
10. ✅ Email Marketing

---

## 💰 Estimativa de Tempo

- **PHASE 1:** 40 horas
- **PHASE 2:** 60 horas
- **PHASE 3:** 50 horas
- **PHASE 4:** 80 horas

**TOTAL:** ~230 horas (~6 semanas de desenvolvimento)

---

## 🚀 Como Começar?

**Quer começar pela:**
1. ✅ **Chat com Agendamento** (mais legal)
2. ✅ **Link Público + Perfil** (mais urgente)
3. ✅ **Pacotes Melhorados** (mais financeiro)
4. ✅ **Dashboard** (visão geral)

**Qual primeiro?**
