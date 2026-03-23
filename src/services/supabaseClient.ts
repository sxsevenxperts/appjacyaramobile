import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gzkwtiihltahvnmtrgfv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6a3d0aWlobHRhaHZubXRyZ2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTIyOTksImV4cCI6MjA4OTc4ODI5OX0.qvaoTJbOSV-6jQ-PwDxunqdt-blScWt7tPEPqiLKVZY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    // Store additional user data in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, ...userData }])

    if (profileError) throw profileError
  }

  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}
