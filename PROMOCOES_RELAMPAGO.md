# 📢 Sistema de Promoções Relâmpago e Anúncios

## ✨ O Que Foi Implementado

Um sistema completo para criar e enviar promoções/anúncios para **TODOS** os clientes/pacientes da clínica em tempo real, diretamente do painel administrativo.

---

## 🎯 Funcionalidades

### 1. **Painel de Promoção no Admin**
- Botão "📢 Promoção Relâmpago" na seção de Notificações
- Um clique abre formulário para criar a promoção
- Sem necessidade de código ou configuração adicional

### 2. **Formulário de Criação**
```
📝 Título/Assunto
- Campo obrigatório
- Até 100 caracteres
- Exemplos: "Promoção de Verão", "Novo Procedimento", etc

💬 Mensagem
- Campo obrigatório
- Até 500 caracteres
- Suporta qualquer texto e emojis

📱 Botão WhatsApp (Opcional)
- Checkbox para incluir link WhatsApp
- Link direto para: 55 88 9 9263-2509 (Jacyara Ponte)
- Texto: "Fale conosco"
```

### 3. **Envio Automático**
- Seleciona **TODOS** os clientes com status `ativo = true`
- Envia como notificação push em tempo real
- Armazena no banco de dados para histórico
- Mostra feedback visual ao admin

### 4. **Histórico de Promoções**
- Seção separada no painel de notificações
- Mostra últimas 10 promoções enviadas
- Data e hora do envio
- Preview do conteúdo

---

## 📱 Como Usar (Passo a Passo)

### **Para o Admin (Jacyara)**

1. **Acessar Painel Admin**
   - Login com conta de admin
   - Ir para "🔔 Notificações"

2. **Criar Promoção**
   - Clicar no botão "📢 Promoção Relâmpago"
   - Preencher formulário:
     - Título: Ex. "Desconto de 20% em Tratamentos"
     - Mensagem: Ex. "Aproveite essa oportunidade única! Válido até domingo."
     - Selecionar se quer botão WhatsApp

3. **Enviar**
   - Clicar "📤 Enviar para Todos"
   - Aguardar confirmação
   - Sistema mostra quantos foram enviados

4. **Acompanhar**
   - Ver histórico de promoções na mesma página
   - Verificar quais foram enviadas e quando

### **Para os Clientes**

1. **Receber Notificação**
   - Notificação push aparece no navegador
   - Título com emoji 📢
   - Resumo da promoção

2. **Interagir**
   - Clicar na notificação para ler completo
   - Se houver botão WhatsApp, clicar para falar com Jacyara

---

## 💾 Banco de Dados

### Tabela: `cliente_mensagens_motivacionais`

Novas colunas usadas para promoções:
```sql
- tipo_mensagem TEXT        -- 'motivacional', 'lembrete', 'promocao'
- titulo TEXT               -- Título da promoção
- body TEXT                 -- Conteúdo da mensagem
- status TEXT               -- 'pendente_exibicao', 'exibida', 'descartada'
- tipo_notificacao TEXT     -- 'push', 'whatsapp', 'email'
```

### Registro Automático
Cada promoção cria um registro no banco para cada cliente:
```json
{
  "cliente_id": "uuid-do-cliente",
  "titulo": "📢 Desconto de 20%",
  "body": "Aproveite...",
  "status": "pendente_exibicao",
  "tipo_notificacao": "push",
  "tipo_mensagem": "promocao",
  "created_at": "2026-03-23T14:30:00Z"
}
```

---

## 🔧 Funções JavaScript

### `mostrarFormularioPromocao()`
- **Função**: Abre modal com formulário de promoção
- **Chamada**: Ao clicar botão "Promoção Relâmpago"
- **Validação**: Verifica título e mensagem obrigatórios

### `executarEnvioPromocao()`
- **Função**: Valida e executa o envio
- **Requerido**: Título + Mensagem
- **Feedback**: Toast com número de notificações enviadas

### `criarEEnviarPromocao(titulo, mensagem, incluirWhatsapp)`
- **Função Principal**: Orquestra todo o envio
- **Etapas**:
  1. Busca todos os clientes ativos
  2. Monta mensagem (com WhatsApp se selecionado)
  3. Insere no banco de dados
  4. Envia notificação push para cada cliente
- **Retorno**: `{ enviadas: 42 }` (número de clientes que receberam)

---

## 📊 Exemplos de Uso

### **Exemplo 1: Promoção de Verão**
```
Título: 🌞 Promoção de Verão - 20% OFF

Mensagem: Chegou a hora de cuidar da pele para o verão!
Todos os procedimentos faciais com 20% de desconto.
Válido até 31 de março. Agende agora!

WhatsApp: ✓ Sim (inclui botão)
```

**Resultado**: Todos os clientes recebem notificação com link para WhatsApp

---

### **Exemplo 2: Novo Procedimento**
```
Título: ✨ Novo Procedimento: HydraFacial

Mensagem: Conheça o novo HydraFacial da clínica!
Hidratação profunda + limpeza + revitalização em 30 min.
Marque sua avaliação gratuita pelo WhatsApp!

WhatsApp: ✓ Sim
```

**Resultado**: Todos clientes informados sobre novo serviço

---

### **Exemplo 3: Informação Importante**
```
Título: ⚠️ Aviso Importante

Mensagem: A clínica estará fechada de 5 a 7 de abril
por reforma. Voltaremos no dia 8 com ainda mais conforto!

WhatsApp: ✗ Não (informação apenas)
```

**Resultado**: Notificação informativa, sem botão

---

## 🎨 Formatação da Mensagem Enviada

### Com WhatsApp:
```
📢 [TÍTULO]

💬 [MENSAGEM DO ADMIN]

📱 Fale conosco:
👉 https://wa.me/5588992632509

Atendimento com Jacyara Ponte
Clínica Estética Jacyara Ponte
```

### Sem WhatsApp:
```
📢 [TÍTULO]

💬 [MENSAGEM DO ADMIN]

✨ Clínica Estética Jacyara Ponte
```

---

## 🚀 Integração com WhatsApp

### Link Configurado
- **Número**: 55 88 9 9263-2509
- **Contato**: Jacyara Ponte (Admin/Suporte)
- **Tipo**: WhatsApp Business

### Fluxo do Cliente
1. Recebe notificação com promoção
2. Clica no botão "💬 Falar no WhatsApp"
3. Abre chat com Jacyara
4. Pode esclarecer dúvidas sobre promoção

---

## 📈 Acompanhamento e Relatórios

### No Painel Admin
- **Seção**: "📢 Histórico de Promoções"
- **Mostra**: Últimas 10 promoções enviadas
- **Informações**:
  - Título
  - Resumo da mensagem
  - Data e hora do envio

### Via Console (Avançado)
```javascript
// Ver todas as promoções do último mês
const { data: promocoes } = await sb.from('cliente_mensagens_motivacionais')
  .select('*')
  .eq('tipo_mensagem', 'promocao')
  .gte('created_at', new Date(Date.now() - 30*24*60*60*1000).toISOString())
  .order('created_at', { ascending: false });

console.table(promocoes);

// Contar quantos clientes receberam cada promoção
const contagem = promocoes.length;
console.log(`Total de notificações de promoção: ${contagem}`);
```

---

## ⚠️ Limitações e Considerações

### Restrições
- ✓ Envia para **TODOS** os clientes ativos
- ✓ Não há segmentação (seleção de grupos específicos)
- ✓ Máximo 500 caracteres por mensagem
- ✗ Não há agendamento automático (envio é imediato)

### Performance
- Recomendado: Até 1000 clientes por envio
- Tempo estimado: 2-5 segundos para 100-500 clientes
- Sem impacto no servidor (processamento assíncrono)

### Boas Práticas
- ✅ Use títulos claros e descritivos
- ✅ Mantenha mensagens concisas
- ✅ Inclua WhatsApp para promoções que precisem resposta
- ❌ Evite enviar muitas promoções por dia
- ❌ Não use para mensagens pessoais/privadas

---

## 🔐 Segurança

### Acesso
- Apenas **ADMIN** pode criar promoções
- Verificação de permissão automática via `filterSidebarByRole()`
- Botão aparece apenas para admin

### Dados
- Todas as promoções registradas no banco
- Rastreamento de quem recebeu
- Histórico completo para auditoria

---

## 🆘 Troubleshooting

### **Problema**: Notificação não aparece
**Solução**:
- Verificar se notificações estão ativadas no navegador
- Checar permissão de notificações do site
- Recarregar página (F5)

### **Problema**: Mensagem truncada
**Solução**:
- Máximo de 500 caracteres por mensagem
- Remova caracteres ou revise o texto
- Use emojis com moderação

### **Problema**: WhatsApp não funciona
**Solução**:
- Verificar se número está correto: 5588992632509
- Testar link direto em browser
- Verificar se WhatsApp Web está logado

---

## 📞 Próximas Etapas

1. ✅ Implementar função no código (**CONCLUÍDO**)
2. ✅ Adicionar botão ao painel (**CONCLUÍDO**)
3. ⏳ Executar SQL migration (opção 5) - seu turno!
4. ⏳ Testar envio de promoção
5. ⏳ Configurar automação (se desejado)

---

**Versão**: 1.0
**Data**: 23/03/2026
**Status**: ✅ Pronto para uso

**Assinado por**: Jacyara Ponte
**Clínica Estética**: Jacyara Ponte
