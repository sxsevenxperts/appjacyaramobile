const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', version: '1.0.0' });
});

// API Routes para dados (mock)
app.get('/api/dashboard', (req, res) => {
    res.json({
        agendamentosHoje: 0,
        totalClientes: 0,
        faturamentoMes: 0,
        ultimaAtualizacao: new Date().toISOString()
    });
});

app.get('/api/agendamentos', (req, res) => {
    res.json({
        agendamentos: [],
        total: 0
    });
});

app.get('/api/clientes', (req, res) => {
    res.json({
        clientes: [],
        total: 0
    });
});

app.get('/api/relatorios', (req, res) => {
    res.json({
        faltas: 0,
        remarcacoes: 0,
        procedimentosVencendo: 0,
        dataRelatorio: new Date().toISOString()
    });
});

// Generate PDF Report
app.get('/api/relatorio/pdf', (req, res) => {
    const relatorio = gerarRelatorioPDF();

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-' + new Date().getTime() + '.txt');
    res.send(relatorio);
});

app.get('/api/relatorio/financeiro/pdf', (req, res) => {
    const relatorio = gerarRelatorioFinanceiroPDF();

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-financeiro-' + new Date().getTime() + '.txt');
    res.send(relatorio);
});

// Gerar Relatório em Texto (compatível com todos os navegadores)
function gerarRelatorioPDF() {
    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');

    return `
╔════════════════════════════════════════════════════════════════╗
║          CLÍNICA ESTÉTICA JACYARA PONTE                        ║
║          Relatório de Atividades                               ║
╚════════════════════════════════════════════════════════════════╝

DATA DO RELATÓRIO: ${dataFormatada} às ${horaFormatada}

════════════════════════════════════════════════════════════════

RESUMO EXECUTIVO
════════════════════════════════════════════════════════════════

Período: ${dataFormatada}
Status: Relatório Completo

────────────────────────────────────────────────────────────────
AGENDAMENTOS
────────────────────────────────────────────────────────────────
  • Agendamentos Este Mês: 0
  • Agendamentos Realizados: 0
  • Agendamentos Pendentes: 0
  • Taxa de Comparecimento: 0%

────────────────────────────────────────────────────────────────
FALTAS E REMARCAÇÕES
────────────────────────────────────────────────────────────────
  • Total de Faltas: 0
  • Clientes com Falta: 0
  • Total de Remarcações: 0
  • Motivo Mais Comum: -

────────────────────────────────────────────────────────────────
CLIENTES
────────────────────────────────────────────────────────────────
  • Total de Clientes: 0
  • Clientes Novos: 0
  • Clientes Ativos: 0
  • Taxa de Retorno: 0%

────────────────────────────────────────────────────────────────
PROCEDIMENTOS
────────────────────────────────────────────────────────────────
  • Procedimentos Realizados: 0
  • Procedimentos Vencendo (≤3 sessões): 0
  • Clientes a Notificar: 0

════════════════════════════════════════════════════════════════

OBSERVAÇÕES IMPORTANTES
════════════════════════════════════════════════════════════════
- Mantenha clientes informados sobre procedimentos vencendo
- Analise padrões de faltas e remarcações
- Acompanhe satisfação dos clientes

════════════════════════════════════════════════════════════════
Relatório gerado automaticamente pelo sistema
Clínica Estética Jacyara Ponte © 2024
════════════════════════════════════════════════════════════════
    `;
}

function gerarRelatorioFinanceiroPDF() {
    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');
    const mesAtual = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    return `
╔════════════════════════════════════════════════════════════════╗
║          CLÍNICA ESTÉTICA JACYARA PONTE                        ║
║          Relatório Financeiro                                  ║
╚════════════════════════════════════════════════════════════════╝

DATA DO RELATÓRIO: ${dataFormatada} às ${horaFormatada}
PERÍODO: ${mesAtual}

════════════════════════════════════════════════════════════════

RESUMO FINANCEIRO
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
RECEITAS
────────────────────────────────────────────────────────────────
  • Faturamento Bruto: R$ 0,00
  • Pagamentos Recebidos: R$ 0,00
  • Pagamentos Pendentes: R$ 0,00
  • Descontos Aplicados: R$ 0,00

────────────────────────────────────────────────────────────────
DESPESAS
────────────────────────────────────────────────────────────────
  • Custos Operacionais: R$ 0,00
  • Custo de Materiais: R$ 0,00
  • Despesas Gerais: R$ 0,00
  • Total de Despesas: R$ 0,00

────────────────────────────────────────────────────────────────
RESULTADO
────────────────────────────────────────────────────────────────
  • Receita Líquida: R$ 0,00
  • Lucro Operacional: R$ 0,00
  • Margem Líquida: 0%

────────────────────────────────────────────────────────────────
MOVIMENTAÇÃO DE PAGAMENTOS
────────────────────────────────────────────────────────────────
  • PIX Recebido: R$ 0,00 (0 transações)
  • Dinheiro Recebido: R$ 0,00 (0 transações)
  • Cheque Recebido: R$ 0,00 (0 transações)
  • Cartão Recebido: R$ 0,00 (0 transações)

────────────────────────────────────────────────────────────────
PROJEÇÃO
────────────────────────────────────────────────────────────────
  • Próximo Mês Estimado: R$ 0,00
  • Tendência: Estável

════════════════════════════════════════════════════════════════

MÉTODOS DE PAGAMENTO
════════════════════════════════════════════════════════════════
  ✓ PIX - Disponível
  ✓ Dinheiro - Disponível
  ✓ Débito/Crédito - Disponível
  ✓ Cheque - Disponível

════════════════════════════════════════════════════════════════

NOTAS FISCAIS E COMPROVANTES
════════════════════════════════════════════════════════════════
Todos os comprovantes de pagamento estão arquivados no sistema.
Consulte o histórico de transações para detalhes completos.

════════════════════════════════════════════════════════════════
Relatório financeiro gerado automaticamente
Clínica Estética Jacyara Ponte © 2024
════════════════════════════════════════════════════════════════
    `;
}

// Error handling
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═════════════════════════════════════════════════════════╗
║  🎉 SERVIDOR WEB INICIADO COM SUCESSO!                ║
╚═════════════════════════════════════════════════════════╝

📱 Aplicação Web: http://localhost:${PORT}
🌐 Acessível em: http://localhost:${PORT}

✅ Funcionalidades:
  • PWA (Progressive Web App)
  • Instalar como app no dispositivo
  • Funciona offline
  • Notificações push
  • Download de PDF

📊 Rotas API:
  • GET /api/dashboard
  • GET /api/agendamentos
  • GET /api/clientes
  • GET /api/relatorios
  • GET /api/relatorio/pdf (Download)
  • GET /api/relatorio/financeiro/pdf (Download)

🔐 Service Worker: Ativado
💾 Cache: Habilitado
📡 Sync Offline: Pronto

Para parar o servidor: CTRL + C
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Servidor desligando...');
    process.exit(0);
});
