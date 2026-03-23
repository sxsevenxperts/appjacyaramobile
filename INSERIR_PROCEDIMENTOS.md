# 📋 Como Cadastrar os Procedimentos no Supabase

## 🔧 Passo a Passo

### 1. Acesse o Supabase
- Vá para: https://app.supabase.com
- Faça login com sua conta
- Selecione o projeto "gzkwtiihltahvnmtrgfv"

### 2. Vá para SQL Editor
- No menu esquerdo, clique em **"SQL Editor"**
- Clique em **"New Query"**

### 3. Cole o SQL Abaixo

```sql
INSERT INTO procedimentos (nome, duracao_minutos, preco_base, descricao) VALUES
('Ultrassom Ultracavitação', 45, 150.00, 'Tratamento não-invasivo que utiliza ultrassom para eliminar gordura localizada através de cavitação. Ideal para redução de medidas e definição de contornos corporais.'),
('Pump Up', 50, 180.00, 'Procedimento inovador de aumento de glúteos sem cirurgia, utilizando tecnologia de radiofrequência e vácuo. Resultados visíveis em poucas sessões.'),
('Radiofrequência', 60, 200.00, 'Tratamento para flacidez e rejuvenescimento de pele utilizando energia de radiofrequência. Estimula colágeno e melhora elasticidade. Pode ser corporal ou facial.'),
('Carboxiterapia', 45, 160.00, 'Injeção de dióxido de carbono medicinal para melhorar circulação, reduzir flacidez e gordura localizada. Excelente para celulite e envelhecimento.'),
('Drenagem', 50, 140.00, 'Massagem drenante especializada que elimina retenção de líquidos, reduz inchaço e promove detoxificação do corpo. Relaxante e terapêutica.'),
('Massagem', 60, 120.00, 'Massagem relaxante e terapêutica para aliviar tensão, melhorar circulação e bem-estar geral. Diferentes técnicas disponíveis.'),
('Peeling', 50, 130.00, 'Esfoliação química ou física da pele para remover células mortas, melhorar textura e reduzir manchas. Deixa pele mais luminosa e renovada.'),
('Limpeza de Pele', 45, 100.00, 'Limpeza profunda com higienização, esfoliação suave e extração de cravos. Ideal para preparar pele para outros tratamentos.'),
('Hidratação Facial', 40, 110.00, 'Tratamento intensivo de hidratação da pele do rosto. Recompõe a umidade, deixa pele macia, brilhante e revitalizada.'),
('Avaliação Especializada', 30, 80.00, 'Consulta profissional com especialista em estética para avaliação completa de pele, corpo e recomendação de tratamentos personalizados.');
```

### 4. Clique em "Run"
- O botão verde "Run" no canto superior direito
- Aguarde a confirmação ✅

### 5. Pronto!
Os 10 procedimentos foram cadastrados:

| # | Procedimento | Duração | Preço |
|---|---|---|---|
| 1 | Ultrassom Ultracavitação | 45 min | R$ 150,00 |
| 2 | Pump Up | 50 min | R$ 180,00 |
| 3 | Radiofrequência | 60 min | R$ 200,00 |
| 4 | Carboxiterapia | 45 min | R$ 160,00 |
| 5 | Drenagem | 50 min | R$ 140,00 |
| 6 | Massagem | 60 min | R$ 120,00 |
| 7 | Peeling | 50 min | R$ 130,00 |
| 8 | Limpeza de Pele | 45 min | R$ 100,00 |
| 9 | Hidratação Facial | 40 min | R$ 110,00 |
| 10 | Avaliação Especializada | 30 min | R$ 80,00 |

---

## ✅ Verificar se foi Inserido

Execute este query para confirmar:

```sql
SELECT nome, duracao_minutos, preco_base 
FROM procedimentos 
ORDER BY criado_em DESC 
LIMIT 10;
```

Deve mostrar os 10 procedimentos que você acabou de inserir.

---

## 🎯 Próximo Passo

Agora no aplicativo:
1. Vá para **Dashboard → Procedimentos**
2. Você verá todos os 10 serviços cadastrados ✨
3. Pode editar preços/durações conforme necessário
4. Clientes verão esses procedimentos no chat de agendamento

---

## 📝 Notas

- **Preços:** Podem ser ajustados depois no painel de admin
- **Duração:** Em minutos (pode ser modificada por procedimento)
- **Descrição:** Aparece no dashboard e em detalhes
- **Chat:** Clientes verão lista simplificada no agendamento