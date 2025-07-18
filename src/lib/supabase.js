import { createClient } from '@supabase/supabase-js'

// Project details from Supabase
const SUPABASE_URL = 'https://griqohscjycuqujixtug.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaXFvaHNjanljdXF1aml4dHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI0MDYsImV4cCI6MjA2ODI4ODQwNn0.kTjCIaBxUjbwq7SJI81UAbMoi8tGcwamNnrcHZTHUrY'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials')
}

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Helper function to check if a string is a valid UUID
export const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// Helper function to format query parameters based on ID type
export const formatIdQuery = (id, fieldName = 'id') => {
  if (isUUID(id)) {
    return { [fieldName]: id }
  }
  // For non-UUID values, use string comparison
  return { [`${fieldName}::text`]: String(id) }
}