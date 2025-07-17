import { createClient } from '@supabase/supabase-js'

// Project details from Supabase
const supabaseUrl = 'https://griqohscjycuqujixtug.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaXFvaHNjanljdXF1aml4dHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI0MDYsImV4cCI6MjA2ODI4ODQwNn0.kTjCIaBxUjbwq7SJI81UAbMoi8tGcwamNnrcHZTHUrY'

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export { supabase }