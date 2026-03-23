/**
 * Team Management Service
 * Gestão de equipe com comissões e performance
 */

export interface TeamMember {
  id: number
  nome: string
  cargo: string
  email: string
  telefone: string
  dataAdmissao: string
  status: 'ativo' | 'inativo'
  comissaoPercentual: number
  totalAtendimentos: number
  totalFaturamento: number
}

export interface Commission {
  id: string
  memberId: number
  mes: string
  ano: number
  faturamento: number
  percentualComissao: number
  valorComissao: number
  dataCalculo: string
  status: 'pendente' | 'pago'
}

export interface PerformanceMetric {
  memberId: number
  totalAtendimentos: number
  clientesSatisfeitos: number
  taxaSatisfacao: number
  procedimentosMaisRealizado: string
  faturamentoTotal: number
}

// Cargos disponíveis
export const CARGOS = [
  'Esteticista',
  'Gerente',
  'Recepcionista',
  'Assistente',
  'Coordenadora',
]

// Comissões padrão por cargo
export const COMISSAO_POR_CARGO: Record<string, number> = {
  'Esteticista': 20, // 20% do faturamento que gerou
  'Gerente': 5,      // 5% do faturamento geral
  'Recepcionista': 0, // Sem comissão (salário fixo)
  'Assistente': 10,   // 10% do faturamento direto
  'Coordenadora': 8,  // 8% do faturamento
}

/**
 * Cria novo membro da equipe
 */
export const createTeamMember = (
  nome: string,
  cargo: string,
  email: string,
  telefone: string
): TeamMember => {
  return {
    id: Date.now(),
    nome,
    cargo,
    email,
    telefone,
    dataAdmissao: new Date().toISOString(),
    status: 'ativo',
    comissaoPercentual: COMISSAO_POR_CARGO[cargo] || 0,
    totalAtendimentos: 0,
    totalFaturamento: 0,
  }
}

/**
 * Calcula comissão de um membro
 */
export const calculateCommission = (
  faturamento: number,
  percentualComissao: number
): number => {
  return (faturamento * percentualComissao) / 100
}

/**
 * Gera comissão para um membro em um período
 */
export const generateCommission = (
  memberId: number,
  mes: number,
  ano: number,
  faturamento: number,
  percentualComissao: number
): Commission => {
  const valorComissao = calculateCommission(faturamento, percentualComissao)

  return {
    id: `COM-${memberId}-${ano}-${mes}`,
    memberId,
    mes: new Date(ano, mes - 1).toLocaleDateString('pt-BR', {
      month: 'long',
    }),
    ano,
    faturamento,
    percentualComissao,
    valorComissao,
    dataCalculo: new Date().toISOString(),
    status: 'pendente',
  }
}

/**
 * Calcula performance geral da equipe
 */
export const calculateTeamPerformance = (members: TeamMember[]) => {
  const totalFaturamento = members.reduce((sum, m) => sum + m.totalFaturamento, 0)
  const totalAtendimentos = members.reduce((sum, m) => sum + m.totalAtendimentos, 0)
  const mediaFaturamentoPorMembro =
    members.length > 0 ? totalFaturamento / members.length : 0

  return {
    totalFaturamento,
    totalAtendimentos,
    mediaFaturamentoPorMembro,
    membrosAtivos: members.filter((m) => m.status === 'ativo').length,
    membrosInativos: members.filter((m) => m.status === 'inativo').length,
  }
}

/**
 * Classifica membros por performance
 */
export const rankTeamMembers = (
  members: TeamMember[]
): Array<TeamMember & { ranking: number }> => {
  return members
    .sort((a, b) => b.totalFaturamento - a.totalFaturamento)
    .map((member, index) => ({
      ...member,
      ranking: index + 1,
    }))
}

/**
 * Calcula bônus por performance (opcional)
 */
export const calculatePerformanceBonus = (
  member: TeamMember,
  metaFaturamento: number
): number => {
  if (member.totalFaturamento >= metaFaturamento) {
    // 5% bônus se atingir meta
    return member.totalFaturamento * 0.05
  }
  return 0
}

/**
 * Gera relatório de equipe
 */
export const generateTeamReport = (members: TeamMember[]): string => {
  const data = new Date()
  const performance = calculateTeamPerformance(members)
  const ranking = rankTeamMembers(members)

  let relatorio = `
╔════════════════════════════════════════════════════════════════╗
║          CLÍNICA ESTÉTICA JACYARA PONTE                        ║
║          Relatório de Equipe                                   ║
╚════════════════════════════════════════════════════════════════╝

DATA: ${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR')}

════════════════════════════════════════════════════════════════

EQUIPE ATIVA
════════════════════════════════════════════════════════════════

Total de Membros: ${members.length}
  • Ativos: ${performance.membrosAtivos}
  • Inativos: ${performance.membrosInativos}

PERFORMANCE GERAL
════════════════════════════════════════════════════════════════
  • Faturamento Total: R$ ${performance.totalFaturamento.toFixed(2)}
  • Total de Atendimentos: ${performance.totalAtendimentos}
  • Média por Membro: R$ ${performance.mediaFaturamentoPorMembro.toFixed(2)}

RANKING DE PERFORMANCE
════════════════════════════════════════════════════════════════
`

  ranking.forEach((member) => {
    const percentualFaturamento =
      performance.totalFaturamento > 0
        ? ((member.totalFaturamento / performance.totalFaturamento) * 100).toFixed(1)
        : 0

    relatorio += `
${member.ranking}º - ${member.nome}
   Cargo: ${member.cargo}
   Atendimentos: ${member.totalAtendimentos}
   Faturamento: R$ ${member.totalFaturamento.toFixed(2)} (${percentualFaturamento}%)
   Status: ${member.status === 'ativo' ? '✓ Ativo' : '✗ Inativo'}
`
  })

  relatorio += `
════════════════════════════════════════════════════════════════
Relatório gerado automaticamente
Clínica Estética Jacyara Ponte © 2024
════════════════════════════════════════════════════════════════
  `

  return relatorio
}

/**
 * Exporta comissões para pagamento
 */
export const exportCommissionsForPayment = (
  commissions: Commission[]
): string => {
  let csv = 'Membro ID,Mês,Ano,Faturamento,Comissão %,Valor Comissão,Status\n'

  commissions.forEach((c) => {
    csv += `${c.memberId},${c.mes},${c.ano},${c.faturamento},${c.percentualComissao},${c.valorComissao},${c.status}\n`
  })

  return csv
}

/**
 * Valida dados de novo membro
 */
export const validateTeamMember = (member: Partial<TeamMember>): string[] => {
  const errors: string[] = []

  if (!member.nome || member.nome.trim().length === 0) {
    errors.push('Nome é obrigatório')
  }

  if (!member.cargo || !CARGOS.includes(member.cargo)) {
    errors.push('Cargo inválido')
  }

  if (!member.email || !member.email.includes('@')) {
    errors.push('Email inválido')
  }

  if (!member.telefone || member.telefone.length < 10) {
    errors.push('Telefone inválido')
  }

  return errors
}
