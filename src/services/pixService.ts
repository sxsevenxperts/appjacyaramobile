/**
 * PIX Payment Service
 * Generates QR codes for PIX payments without external payment gateway
 */

// PIX Account Information (should be moved to Supabase config)
const PIX_CONFIG = {
  chave: 'jacyara@clinicaestetica.com', // PIX key (can be email, phone, CPF, or random UUID)
  nomeRecebedor: 'Clínica Estética Jacyara Ponte',
  cidadeRecebedor: 'Seu Município',
}

/**
 * Generates a PIX QR Code payload for static PIX
 * This is a simplified version - in production, use a proper QR code generation library
 */
export const generatePixQrCode = (amount: number): string => {
  // Format: https://www.bcb.gov.br/pix
  // This is a placeholder - actual implementation would use proper EMV QR Code format
  const formattedAmount = amount.toFixed(2).replace('.', '')

  // Basic EMV structure (simplified)
  const pixPayload = `00020126580014br.gov.bcb.pix0136${PIX_CONFIG.chave}520400005303986540${formattedAmount}5802BR5913${PIX_CONFIG.nomeRecebedor}6009${PIX_CONFIG.cidadeRecebedor}62410503***63041D3D`

  return pixPayload
}

/**
 * Generate a payment reference with timestamp
 */
export const generatePaymentReference = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `PIX-${timestamp}-${random}`
}

/**
 * Format currency for display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Parse PIX key (can be email, phone, CPF, or random UUID)
 */
export const isValidPixKey = (key: string): boolean => {
  // Simple validation - in production, this should be more robust
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\d{11}$/
  const cpfRegex = /^\d{11}$/
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

  return (
    emailRegex.test(key) ||
    phoneRegex.test(key) ||
    cpfRegex.test(key) ||
    uuidRegex.test(key)
  )
}

/**
 * Create a PIX payment request (to be saved in Supabase)
 */
export interface PixPaymentRequest {
  id: string
  referencia: string
  valor: number
  chave_pix: string
  cliente_id: number
  data_criacao: string
  data_vencimento: string
  status: 'pendente' | 'pago' | 'expirado'
  descricao: string
}

export const createPixPaymentRequest = (
  clienteId: number,
  valor: number,
  descricao: string,
  diasVencimento: number = 3
): PixPaymentRequest => {
  const hoje = new Date()
  const vencimento = new Date(hoje.getTime() + diasVencimento * 24 * 60 * 60 * 1000)

  return {
    id: generatePaymentReference(),
    referencia: generatePaymentReference(),
    valor,
    chave_pix: PIX_CONFIG.chave,
    cliente_id: clienteId,
    data_criacao: hoje.toISOString(),
    data_vencimento: vencimento.toISOString(),
    status: 'pendente',
    descricao,
  }
}
