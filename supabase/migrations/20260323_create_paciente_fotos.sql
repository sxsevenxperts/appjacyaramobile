-- Migration: Create paciente_fotos_prontuario table for before/after photos
-- Date: 2026-03-23
-- Purpose: Store patient before/after photos with periodic dates

CREATE TABLE IF NOT EXISTS paciente_fotos_prontuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  foto_antes_url VARCHAR(512),
  foto_depois_url VARCHAR(512),
  data_foto DATE DEFAULT CURRENT_DATE,
  proxima_data_agendada DATE,
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  criado_por UUID REFERENCES profiles(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_paciente_fotos_cliente_id 
ON paciente_fotos_prontuario(cliente_id);

CREATE INDEX IF NOT EXISTS idx_paciente_fotos_data 
ON paciente_fotos_prontuario(data_foto DESC);

CREATE INDEX IF NOT EXISTS idx_paciente_fotos_proxima_data 
ON paciente_fotos_prontuario(proxima_data_agendada);

-- Enable RLS
ALTER TABLE paciente_fotos_prontuario ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users (clinic staff) can manage photos
CREATE POLICY "authenticated_can_view_paciente_fotos" 
ON paciente_fotos_prontuario FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_insert_paciente_fotos" 
ON paciente_fotos_prontuario FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_update_paciente_fotos" 
ON paciente_fotos_prontuario FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_delete_paciente_fotos" 
ON paciente_fotos_prontuario FOR DELETE 
USING (auth.role() = 'authenticated');
