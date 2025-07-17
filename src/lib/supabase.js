import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://griqohscjycuqujixtug.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaXFvaHNjanljdXF1aml4dHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI0MDYsImV4cCI6MjA2ODI4ODQwNn0.kTjCIaBxUjbwq7SJI81UAbMoi8tGcwamNnrcHZTHUrY'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase