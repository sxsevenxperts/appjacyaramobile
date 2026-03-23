/**
 * WhatsApp Integration Service
 * Handles message templates and reminder notifications
 */

interface MessageTemplate {
  id: string
  nome: string
  conteudo: string
  variáveis: string[]
}

export const messageTemplates: Record<string, MessageTemplate> = {
  APPOINTMENT_REMINDER: {
    id: 'appointment_reminder',
    nome: 'Lembrete de Agendamento',
    conteudo:
      'Olá {{cliente_nome}}! 👋\n\nEste é um lembrete sobre seu agendamento:\n\n📅 Data: {{data}}\n🕐 Horário: {{horario}}\n💆 Procedimento: {{procedimento}}\n\nTem alguma dúvida? Entre em contato conosco.\n\nAtt,\nClínica Estética Jacyara Ponte',
    variáveis: ['cliente_nome', 'data', 'horario', 'procedimento'],
  },
  APPOINTMENT_CONFIRMATION: {
    id: 'appointment_confirmation',
    nome: 'Confirmação de Agendamento',
    conteudo:
      'Olá {{cliente_nome}}! ✨\n\nSeu agendamento foi confirmado:\n\n📅 Data: {{data}}\n🕐 Horário: {{horario}}\n💆 Procedimento: {{procedimento}}\n📍 Local: {{endereco}}\n\nQualquer dúvida, nos chame no WhatsApp!\n\nAtt,\nClínica Estética Jacyara Ponte',
    variáveis: ['cliente_nome', 'data', 'horario', 'procedimento', 'endereco'],
  },
  PROCEDURE_RENEWAL: {
    id: 'procedure_renewal',
    nome: 'Alerta de Procedimento Vencendo',
    conteudo:
      'Olá {{cliente_nome}}! 💫\n\nEste é um lembrete de que seu pacote de {{procedimento}} está terminando.\n\nSessões restantes: {{sessoes_restantes}}\n\nAgende sua próxima sessão agora mesmo! 📞\n\nAtt,\nClínica Estética Jacyara Ponte',
    variáveis: ['cliente_nome', 'procedimento', 'sessoes_restantes'],
  },
  NO_SHOW_NOTIFICATION: {
    id: 'no_show_notification',
    nome: 'Notificação de Falta',
    conteudo:
      'Olá {{cliente_nome}}! 📌\n\nNotamos que você faltou ao seu agendamento de {{data}}.\n\nGostaria de remarcar? Temos horários disponíveis para {{procedimento}}.\n\nEntre em contato conosco!\n\nAtt,\nClínica Estética Jacyara Ponte',
    variáveis: ['cliente_nome', 'data', 'procedimento'],
  },
  PAYMENT_REQUEST: {
    id: 'payment_request',
    nome: 'Solicitação de Pagamento',
    conteudo:
      'Olá {{cliente_nome}}! 💳\n\nSua fatura está pronta para pagamento:\n\n📋 Descrição: {{descricao}}\n💰 Valor: {{valor}}\n📅 Vencimento: {{data_vencimento}}\n\nProcedimento via PIX:\n{{pix_qr_code}}\n\nAtt,\nClínica Estética Jacyara Ponte',
    variáveis: ['cliente_nome', 'descricao', 'valor', 'data_vencimento', 'pix_qr_code'],
  },
}

/**
 * Substitui variáveis no template com valores reais
 */
export const renderTemplate = (
  templateId: string,
  variables: Record<string, any>
): string => {
  const template = messageTemplates[templateId]
  if (!template) return ''

  let message = template.conteudo

  template.variáveis.forEach((variavel) => {
    const value = variables[variavel] || `{{${variavel}}}`
    message = message.replace(`{{${variavel}}}`, String(value))
  })

  return message
}

/**
 * Gera URL do WhatsApp para envio de mensagem
 * Pode ser usado para redirecionar para WhatsApp Web ou App
 */
export const generateWhatsAppLink = (
  phoneNumber: string,
  message: string
): string => {
  const encodedMessage = encodeURIComponent(message)
  // Remove caracteres especiais do telefone
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Prepara mensagem de lembrete automático
 */
export const prepareReminderMessage = (
  appointmentData: any
): { template: MessageTemplate; message: string; whatsappLink: string } => {
  const template = messageTemplates.APPOINTMENT_REMINDER
  const message = renderTemplate('APPOINTMENT_REMINDER', {
    cliente_nome: appointmentData.cliente_nome,
    data: appointmentData.data_formatada, // ex: "25 de março"
    horario: appointmentData.horario, // ex: "14:30"
    procedimento: appointmentData.procedimento,
  })

  const whatsappLink = generateWhatsAppLink(
    appointmentData.cliente_telefone,
    message
  )

  return { template, message, whatsappLink }
}

/**
 * Prepara mensagem de alerta de procedimento vencendo
 */
export const prepareRenewalMessage = (clientData: any) => {
  const template = messageTemplates.PROCEDURE_RENEWAL
  const message = renderTemplate('PROCEDURE_RENEWAL', {
    cliente_nome: clientData.nome,
    procedimento: clientData.procedimento,
    sessoes_restantes: clientData.sessoes_restantes,
  })

  const whatsappLink = generateWhatsAppLink(clientData.telefone, message)

  return { template, message, whatsappLink }
}

/**
 * Envia mensagem via API (requer configuração da conta WhatsApp Business)
 * Este é um exemplo de implementação - requires WHATSAPP_BUSINESS_API_TOKEN
 */
export const sendWhatsAppMessageViaAPI = async (
  phoneNumber: string,
  message: string,
  apiToken: string,
  phoneNumberId: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message },
        }),
      }
    )

    return response.ok
  } catch (error) {
    console.error('WhatsApp API Error:', error)
    return false
  }
}

/**
 * Gera lista de clientes para notificação (procedimentos vencendo)
 */
export const getClientsToNotify = (packages: any[]): any[] => {
  return packages
    .filter((pkg) => pkg.sessoes_restantes <= 3 && pkg.sessoes_restantes > 0)
    .map((pkg) => ({
      ...pkg,
      motivo: 'Procedimento com poucas sessões restantes',
    }))
}
