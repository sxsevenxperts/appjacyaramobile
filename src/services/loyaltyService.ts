/**
 * Loyalty Program Service
 * Handles points, coupons, VIP levels, and rewards
 */

export interface VIPLevel {
  id: number
  nivel: string
  descricao: string
  pontos_minimos: number
  desconto_percentual: number
  beneficios: string[]
}

export interface LoyaltyPoint {
  id: string
  cliente_id: number
  pontos: number
  tipo: 'compra' | 'referência' | 'aniversário' | 'bônus'
  descricao: string
  data: string
}

export interface Coupon {
  id: string
  cliente_id: number
  codigo: string
  tipo: 'percentual' | 'fixo'
  valor: number
  validade: string
  utilizado: boolean
  data_utilizacao?: string
}

// VIP Levels (configurável)
export const VIP_LEVELS: VIPLevel[] = [
  {
    id: 1,
    nivel: 'Bronze',
    descricao: 'Início da jornada',
    pontos_minimos: 0,
    desconto_percentual: 0,
    beneficios: ['Acumular pontos', 'Acesso a ofertas'],
  },
  {
    id: 2,
    nivel: 'Prata',
    descricao: 'Cliente frequente',
    pontos_minimos: 500,
    desconto_percentual: 5,
    beneficios: ['5% de desconto', 'Prioridade em agendamento', 'Pontos dobrados'],
  },
  {
    id: 3,
    nivel: 'Ouro',
    descricao: 'VIP exclusivo',
    pontos_minimos: 1500,
    desconto_percentual: 10,
    beneficios: [
      '10% de desconto',
      'Agendamento prioritário',
      'Pontos triplicados',
      'Sessões grátis',
    ],
  },
  {
    id: 4,
    nivel: 'Platina',
    descricao: 'Cliente premium',
    pontos_minimos: 3000,
    desconto_percentual: 15,
    beneficios: [
      '15% de desconto',
      'Agendamento prioritário 24h',
      'Pontos quadriplicados',
      'Procedimentos grátis',
      'Atendimento VIP',
    ],
  },
]

/**
 * Calcula pontos baseado no valor da compra
 * Padrão: 1 ponto a cada R$ 10 gasto
 */
export const calculatePointsFromPurchase = (valor: number): number => {
  return Math.floor(valor / 10)
}

/**
 * Determina o nível VIP baseado na quantidade de pontos
 */
export const getVIPLevel = (totalPoints: number): VIPLevel => {
  for (let i = VIP_LEVELS.length - 1; i >= 0; i--) {
    if (totalPoints >= VIP_LEVELS[i].pontos_minimos) {
      return VIP_LEVELS[i]
    }
  }
  return VIP_LEVELS[0]
}

/**
 * Calcula desconto baseado no nível VIP
 */
export const calculateDiscount = (valor: number, vipLevel: VIPLevel): number => {
  return (valor * vipLevel.desconto_percentual) / 100
}

/**
 * Calcula valor final com desconto VIP
 */
export const calculateFinalPrice = (
  valor: number,
  vipLevel: VIPLevel
): { original: number; desconto: number; final: number } => {
  const desconto = calculateDiscount(valor, vipLevel)
  return {
    original: valor,
    desconto,
    final: valor - desconto,
  }
}

/**
 * Gera código de cupom único
 */
export const generateCouponCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Cria cupom para cliente
 */
export const createCoupon = (
  clienteId: number,
  tipo: 'percentual' | 'fixo',
  valor: number,
  diasValidade: number = 30
): Coupon => {
  const hoje = new Date()
  const validade = new Date(hoje.getTime() + diasValidade * 24 * 60 * 60 * 1000)

  return {
    id: `COUPON-${Date.now()}`,
    cliente_id: clienteId,
    codigo: generateCouponCode(),
    tipo,
    valor,
    validade: validade.toISOString().split('T')[0],
    utilizado: false,
  }
}

/**
 * Calcula valor do cupom aplicado
 */
export const applyCoupon = (
  valor: number,
  coupon: Coupon
): { desconto: number; final: number } => {
  let desconto = 0

  if (coupon.tipo === 'percentual') {
    desconto = (valor * coupon.valor) / 100
  } else {
    desconto = Math.min(coupon.valor, valor) // Não pode descontar mais que o valor
  }

  return {
    desconto,
    final: valor - desconto,
  }
}

/**
 * Validar se cupom pode ser usado
 */
export const isCouponValid = (coupon: Coupon, dataAtual?: Date): boolean => {
  if (coupon.utilizado) return false

  const dataValidade = new Date(coupon.validade)
  const hoje = dataAtual || new Date()

  return hoje <= dataValidade
}

/**
 * Cria record de ponto de fidelidade
 */
export const createLoyaltyPoint = (
  clienteId: number,
  pontos: number,
  tipo: 'compra' | 'referência' | 'aniversário' | 'bônus',
  descricao: string
): LoyaltyPoint => {
  return {
    id: `POINTS-${Date.now()}`,
    cliente_id: clienteId,
    pontos,
    tipo,
    descricao,
    data: new Date().toISOString(),
  }
}

/**
 * Calcula progressão até próximo nível VIP
 */
export const getProgressToNextLevel = (
  totalPoints: number
): { currentLevel: VIPLevel; nextLevel?: VIPLevel; pontosFaltando: number; percentual: number } => {
  const currentLevel = getVIPLevel(totalPoints)
  const nextLevelIndex = VIP_LEVELS.findIndex((l) => l.id === currentLevel.id) + 1

  if (nextLevelIndex >= VIP_LEVELS.length) {
    return {
      currentLevel,
      pontosFaltando: 0,
      percentual: 100,
    }
  }

  const nextLevel = VIP_LEVELS[nextLevelIndex]
  const pontosFaltando = nextLevel.pontos_minimos - totalPoints
  const pontos_intervalo =
    nextLevel.pontos_minimos - currentLevel.pontos_minimos
  const percentual =
    ((totalPoints - currentLevel.pontos_minimos) / pontos_intervalo) * 100

  return {
    currentLevel,
    nextLevel,
    pontosFaltando,
    percentual: Math.min(percentual, 100),
  }
}

/**
 * Resgata pontos em desconto ou cupom
 */
export const redeemPoints = (
  clienteId: number,
  pontos: number
): { tipoCupom: 'percentual' | 'fixo'; valor: number; cupom: Coupon } => {
  // Conversão: 100 pontos = R$ 10 de desconto
  const valorDesconto = (pontos / 100) * 10

  const cupom = createCoupon(
    clienteId,
    'fixo',
    valorDesconto,
    30 // válido por 30 dias
  )

  return {
    tipoCupom: 'fixo',
    valor: valorDesconto,
    cupom,
  }
}
