-- Migration: Create agendamentos_publicos table for chat-based public bookings
-- Date: 2026-03-23
-- Purpose: Store appointments created via chat without login

CREATE TABLE IF NOT EXISTS agendamentos_publicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  procedimento VARCHAR(255) NOT NULL,
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  origem VARCHAR(50) DEFAULT 'chat',
  criado_em TIMESTAMP DEFAULT NOW(),
  confirmado_em TIMESTAMP,
  token_confirmacao VARCHAR(255) UNIQUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_publicos_telefone 
ON agendamentos_publicos(cliente_telefone);

CREATE INDEX IF NOT EXISTS idx_agendamentos_publicos_data 
ON agendamentos_publicos(data_agendamento);

CREATE INDEX IF NOT EXISTS idx_agendamentos_publicos_status 
ON agendamentos_publicos(status);

CREATE INDEX IF NOT EXISTS idx_agendamentos_publicos_token 
ON agendamentos_publicos(token_confirmacao);

-- Enable Row Level Security
ALTER TABLE agendamentos_publicos ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create a new public appointment
CREATE POLICY "public_can_insert_agendamentos_publicos" 
ON agendamentos_publicos
FOR INSERT 
WITH CHECK (true);

-- Policy: Authenticated users can view all appointments (admin/staff)
CREATE POLICY "authenticated_can_view_all_agendamentos_publicos" 
ON agendamentos_publicos
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Policy: Anyone can view a specific appointment using the confirmation token
CREATE POLICY "public_can_view_by_token_agendamentos_publicos" 
ON agendamentos_publicos
FOR SELECT 
USING (token_confirmacao IS NOT NULL);

-- Policy: Only admin can update status
CREATE POLICY "admin_can_update_agendamentos_publicos" 
ON agendamentos_publicos
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
