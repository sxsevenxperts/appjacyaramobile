# 🖱️ Exatamente Onde Clicar - Com Descrição

## PASSO 1: Abrir Supabase

**Clique aqui na barra de endereço:**

```
┌──────────────────────────────────────────────────────────┐
│ ← → ⟳   supabase.com/dashboard          🔒 🔍           │
└──────────────────────────────────────────────────────────┘
       ↑
   CLIQUE AQUI
```

Escreva: `supabase.com/dashboard`

Pressione: **ENTER**

---

## PASSO 2: Fazer Login (se pedirEmAIL)

Você vê:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│        Sign In to Supabase                             │
│                                                         │
│     Email:  [_____________________]                    │
│                                                         │
│     Password: [_____________________]                  │
│                                                         │
│              [SIGN IN]                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Clique no campo Email, escreva seu email
Clique no campo Password, escreva sua senha
Clique [SIGN IN]

---

## PASSO 3: Você Está no Dashboard

Você vê seus projetos:

```
┌──────────────────────────────────────────────────────────┐
│  Supabase Dashboard                                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Seus Projetos:                                          │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  📦 Clínica Estética Jacyara Ponte               │ │
│  │     gzkwtiihltahvnmtrgfv.supabase.co             │ │
│  │                                                  │ │
│  │              [CLIQUE AQUI] ←────────────────────┼─┼─
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Clique no projeto "Clínica Estética Jacyara Ponte"**

---

## PASSO 4: Você Entrou no Projeto

Você vê um menu no lado esquerdo:

```
┌─────────────┐
│ MENU        │
├─────────────┤
│ Home        │
│ Auth        │
│ Database    │
│ Storage     │
│ Realtime    │
│ SQL Editor  │ ← CLIQUE AQUI!
│ Reports     │
│ Settings    │
└─────────────┘
```

**Clique em "SQL Editor"**

---

## PASSO 5: SQL Editor Abriu

Você vê uma página assim:

```
┌────────────────────────────────────────────────────────────┐
│  SQL Editor        [+ New Query] ←─────── CLIQUE AQUI!     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                                                            │
│        [Área em branco vazia - vai colar aqui]            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                               [RUN] [Ctrl+Enter]   ↑       │
└────────────────────────────────────────────────────────────┘
                                                     CLIQUE AQUI DEPOIS
```

**PRIMEIRO: Clique em [+ New Query]**

---

## PASSO 6: Nova Query Abriu

Agora você vê:

```
┌────────────────────────────────────────────────────────────┐
│  SQL Editor        [+ New Query]                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  untitled-query (em abas no topo)                          │
│                                                            │
│        [Área em branco - CLIQUE AQUI PARA COLAR]          │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                               [RUN]         Ctrl+Enter     │
└────────────────────────────────────────────────────────────┘
```

**Clique na área em branco**
Você vê um cursor piscando

---

## PASSO 7: Colar o Código

Você tem o código copiado?

Se NÃO:
1. Abra: `COPIAR_COLAR_AGORA.txt` (ou `MIGRATION_5_SQL.sql`)
2. Selecione todo o código (Ctrl+A)
3. Copie (Ctrl+C)

Se SIM:
1. **Pressione: Ctrl+V**
2. O código aparece na tela

Você vê:

```
┌────────────────────────────────────────────────────────────┐
│  SQL Editor                                                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ALTER TABLE cliente_mensagens_motivacionais               │
│  ADD COLUMN IF NOT EXISTS tipo_mensagem TEXT ...           │
│                                                            │
│  CREATE INDEX IF NOT EXISTS idx_cliente_msg_tipo_msg       │
│  ON cliente_mensagens_motivacionais(...);                  │
│                                                            │
│  CREATE INDEX IF NOT EXISTS idx_msg_promo_data             │
│  ON cliente_mensagens_motivacionais(...);                  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                               [RUN]                        │
└────────────────────────────────────────────────────────────┘
```

---

## PASSO 8: Executar (CLIQUE NO RUN)

Você vê o botão [RUN] no canto inferior direito:

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  [Seu código aqui]                                         │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                               [RUN] ←── CLIQUE AQUI!       │
└────────────────────────────────────────────────────────────┘
```

**CLIQUE em [RUN]**

---

## PASSO 9: Aguarde Resultado

Você vê:

```
⏳ Processando... (aguarde 3-5 segundos)
```

---

## PASSO 10: Vê o Resultado

Aparece uma mensagem:

### **OPÇÃO 1: SUCESSO! ✅**

```
✅ Query successful!
Execution time: 0.5ms
```

ou

```
✅ 3 of 3 queries successful!
```

**PARABÉNS! 🎉 PRONTO!**

---

### **OPÇÃO 2: Aviso "Already Exists"**

```
⚠️ ERROR: column "tipo_mensagem" already exists
```

**Sem problema!**
Significa que já foi criado. Tudo OK!

---

### **OPÇÃO 3: Outro erro**

Se for outro erro:
1. Tenta de novo
2. Ou me avisa que eu vejo

---

## 📸 RESUMO VISUAL

```
SUPABASE DASHBOARD
        ↓
   [Clique no projeto]
        ↓
   SQL EDITOR
        ↓
   [+ New Query]
        ↓
   [Cola o código]
        ↓
   [RUN]
        ↓
   ✅ SUCCESS!
        ↓
   🎉 PRONTO!
```

---

## ✅ Você Conseguiu?

Quando vir:
```
✅ Query successful!
```

**AVISE PARA MIM!**

Depois a gente testa a promoção no seu app! 🚀

---

**AGORA MESMO! Vamos lá! 💪**
