# 📢 Guia Rápido: Como Usar Promoções Relâmpago

## ⚡ Em 30 Segundos

1. **Login no Painel** → Admin
2. **Clique em "🔔 Notificações"** → Na barra de navegação
3. **Clique em "📢 Promoção Relâmpago"** → Botão "Criar & Enviar"
4. **Preencha o formulário**:
   - 📝 **Título**: Título da promoção (ex: "20% OFF em Limpeza Facial")
   - 💬 **Mensagem**: Detalhes (até 500 caracteres)
   - 📱 **WhatsApp**: Marque se quer incluir botão para clientes falarem com você
5. **Clique "📤 Enviar para Todos"**
6. **Pronto!** Todos os clientes recebem a notificação em tempo real

---

## 📋 Checklist Antes de Enviar

- [ ] Título claro e atrativo?
- [ ] Mensagem tem informações principais (desconto%, validade, etc)?
- [ ] Incluir WhatsApp para contato? (recomendado para promoções)
- [ ] Verificar typos ou erros?
- [ ] Horário apropriado para envio?

---

## 💡 Exemplos Prontos para Copiar

### **Promoção 1: Desconto Facial**
```
Título: ☀️ Cuide da Pele para o Verão - 20% OFF

Mensagem:
Chegou a hora de preparar sua pele para o verão!
Todos os procedimentos faciais com 20% de desconto.
✨ Limpeza Profunda
✨ Peeling
✨ Hidratação Facial
Válido até 31 de março!

WhatsApp: ✓ SIM (para agendar)
```

---

### **Promoção 2: Procedimentos Corporais**
```
Título: 💪 Combo Verão: Ultrassom + Drenagem 30% OFF

Mensagem:
Prepare seu corpo para a estação!
Aproveite o combo especial de procedimentos corporais.
Redução de medidas + Drenagem linfática = Resultados!
Promoção válida de 24 a 30 de março.

WhatsApp: ✓ SIM (para detalhes do combo)
```

---

### **Promoção 3: Novo Serviço**
```
Título: ✨ NOVO: HydraFacial - Beleza em 30 Minutos

Mensagem:
Você pediu, nós trouxemos!
HydraFacial é o tratamento mais avançado em hidratação facial.
Deixa a pele brilhante, lisa e radiante em apenas meia hora!
Agende sua sessão de introdução agora.

WhatsApp: ✓ SIM (para conhecer o procedimento)
```

---

### **Aviso Importante**
```
Título: ⚠️ Aviso Importante para Você

Mensagem:
A clínica estará em manutenção de 5 a 7 de abril.
Voltaremos no dia 8 com ainda mais infraestrutura!
Aproveite o período para descansar e depois continuar seus tratamentos.

WhatsApp: ✗ NÃO (informação apenas)
```

---

## ✅ O Que Acontece Depois

### **Para Você (Admin)**
- ✓ Confirmação imediata: "✅ 127 notificações enviadas"
- ✓ Aparece no histórico de promoções
- ✓ Pode acompanhar quantas foram visualizadas (status no banco)

### **Para os Clientes**
- ✓ Recebem notificação push no navegador/app
- ✓ Veem o título com emoji 📢
- ✓ Podem clicar para ler mensagem completa
- ✓ Se houver WhatsApp, podem clicar direto para chamar

---

## 🚫 Erros Comuns (e como evitar)

### ❌ **Erro**: Campo em branco
```
Solução: Preencha TODOS os campos obrigatórios:
- Título (não pode estar vazio)
- Mensagem (não pode estar vazio)
```

### ❌ **Erro**: Mensagem muito longa
```
Solução: Máximo 500 caracteres
Corte informações desnecessárias, seja direto!
```

### ❌ **Erro**: WhatsApp não funciona
```
Solução: Número está correto: 5588992632509
Se mesmo assim não funcionar, copie o link:
https://wa.me/5588992632509
```

---

## 📊 Frequência Recomendada

| Tipo | Frequência | Dica |
|------|-----------|------|
| **Promoção** | 2-3x/semana | Horário: terça-feira, quinta-feira, sábado (08:00) |
| **Aviso importante** | Conforme necessário | Use raramente para não desalentar clientes |
| **Novo serviço** | 1-2x/mês | Combine com email e WhatsApp |
| **Desconto sazonal** | Mensal | Fim de mês ou datas comemorativas |

---

## 🎯 Dicas de Sucesso

### 1. **Use Emojis**
- ✨ Deixa mais atrativo
- 🎁 Chama atenção para promoção
- ⏰ Mostra urgência se necessário

### 2. **Seja Direto**
- ❌ "A clínica está com uma promoção especial..."
- ✅ "20% OFF em Limpeza Facial até domingo!"

### 3. **Sempre Inclua WhatsApp**
- Aumenta conversão em 300%
- Clientes podem tirar dúvidas rapidinho
- Você consegue vender enquanto está atendendo

### 4. **Horários Estratégicos**
- **Manhã** (08:00-09:00): Profissionais no trabalho
- **Almoço** (12:00-13:00): Pausa do trabalho
- **Noite** (19:00-20:00): Em casa relaxando

### 5. **Ofereça Algo de Valor**
- Não venda só preço, venda benefício
- "Pele lisa e radiante em 30 min" > "Peeling 50% OFF"

---

## 🔐 Quem Pode Usar?

- ✅ **Admin (Jacyara)**: Acesso total
- ✅ **Admin da clínica**: Se criado com role=admin
- ❌ **Recepcionista**: Não vê botão
- ❌ **Profissional**: Não vê botão
- ❌ **Cliente**: Não vê botão

---

## 📞 Precisa de Ajuda?

### **Pergunta**: Quantos clientes vão receber?
**Resposta**: Todos os clientes com `ativo = true` no banco

### **Pergunta**: Posso agendar para depois?
**Resposta**: Não (versão 1.0 envia imediato). Próximas versões terão agendamento.

### **Pergunta**: Posso enviar para apenas alguns clientes?
**Resposta**: Não (v1.0 é broadcast). Próximas versões terão segmentação.

### **Pergunta**: A promoção expira sozinha?
**Resposta**: Não, você precisa avisar o fim da promoção num novo anúncio

### **Pergunta**: Posso editar depois de enviar?
**Resposta**: Não, mas pode enviar uma correção como novo anúncio

---

## 🚀 Próximas Melhorias (Roadmap)

- ⏳ Agendamento de promoções (enviar em data/hora específica)
- ⏳ Segmentação de clientes (apenas corpo, apenas facial, etc)
- ⏳ Templates de promoção pré-formatadas
- ⏳ Analytics: quantas viram, quantas clicaram
- ⏳ A/B testing de títulos e mensagens

---

**Versão**: 1.0
**Última atualização**: 23/03/2026
**Assinado por**: Jacyara Ponte
**Clínica**: Clínica Estética Jacyara Ponte
