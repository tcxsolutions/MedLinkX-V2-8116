import { supabase } from '../lib/supabase';

// Create required tables
export const createTables = async () => {
  try {
    // Create diagnostic codes table
    const { error: diagnosticError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'diagnostic_codes_medlink_x7a9b2c3',
      schema: `
        CREATE TABLE diagnostic_codes_medlink_x7a9b2c3 (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          UNIQUE(code)
        );
      `
    });

    if (diagnosticError) throw diagnosticError;

    // Create visit diagnoses table
    const { error: visitDiagnosesError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'visit_diagnoses_medlink_x7a9b2c3',
      schema: `
        CREATE TABLE visit_diagnoses_medlink_x7a9b2c3 (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          visit_id UUID NOT NULL,
          diagnostic_code_id UUID NOT NULL,
          primary BOOLEAN DEFAULT false,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          created_by TEXT,
          FOREIGN KEY (visit_id) REFERENCES patient_visits_medlink_x7a9b2c3(id) ON DELETE CASCADE,
          FOREIGN KEY (diagnostic_code_id) REFERENCES diagnostic_codes_medlink_x7a9b2c3(id) ON DELETE CASCADE
        );
      `
    });

    if (visitDiagnosesError) throw visitDiagnosesError;

    // Create patient notes table
    const { error: notesError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'patient_notes_medlink_x7a9b2c3',
      schema: `
        CREATE TABLE patient_notes_medlink_x7a9b2c3 (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          patient_id UUID NOT NULL,
          visit_id UUID,
          note_type TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          created_by TEXT,
          FOREIGN KEY (patient_id) REFERENCES patients_medlink_x7a9b2c3(id) ON DELETE CASCADE,
          FOREIGN KEY (visit_id) REFERENCES patient_visits_medlink_x7a9b2c3(id) ON DELETE CASCADE
        );
      `
    });

    if (notesError) throw notesError;

    // Create other required tables...
    // Add more table creation logic as needed

    return { success: true };
  } catch (error) {
    console.error('Error creating tables:', error);
    return { success: false, error: error.message };
  }
};

// Initialize database with required tables and data
export const initializeDatabase = async () => {
  try {
    // Create tables
    const { error } = await createTables();
    if (error) throw error;

    // Add any initial data if needed
    // For example, adding some common diagnostic codes

    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error: error.message };
  }
};