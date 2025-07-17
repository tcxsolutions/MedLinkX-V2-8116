import { supabase } from '../lib/supabase';

// Table names with suffixes to avoid conflicts
const PATIENTS_TABLE = 'patients_medlink_x7a9b2c3';
const NOTES_TABLE = 'patient_notes_medlink_x7a9b2c3';
const VISITS_TABLE = 'patient_visits_medlink_x7a9b2c3';
const VITALS_TABLE = 'patient_vitals_medlink_x7a9b2c3';
const PRESCRIPTIONS_TABLE = 'patient_prescriptions_medlink_x7a9b2c3';

/**
 * Initialize all database tables with proper structure
 */
export const initializeDatabase = async () => {
  try {
    console.log('Initializing database tables...');
    
    // Create patients table
    await createPatientsTable();
    
    // Create related tables
    await createNotesTable();
    await createVisitsTable();
    await createVitalsTable();
    await createPrescriptionsTable();
    
    // Insert sample data
    await insertSamplePatients();
    
    console.log('Database initialization completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create patients table
 */
const createPatientsTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${PATIENTS_TABLE} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth DATE,
      gender TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      blood_type TEXT,
      allergies TEXT[],
      insurance_provider TEXT,
      insurance_policy_number TEXT,
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      family_notes TEXT,
      practice_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  if (error && !error.message.includes('already exists')) {
    throw error;
  }

  // Enable RLS
  await supabase.rpc('exec_sql', { 
    sql: `ALTER TABLE ${PATIENTS_TABLE} ENABLE ROW LEVEL SECURITY;` 
  });

  // Create RLS policies
  await supabase.rpc('exec_sql', { 
    sql: `
      CREATE POLICY "Allow all operations" ON ${PATIENTS_TABLE}
      FOR ALL USING (true) WITH CHECK (true);
    ` 
  });
};

/**
 * Create patient notes table
 */
const createNotesTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${NOTES_TABLE} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID REFERENCES ${PATIENTS_TABLE}(id) ON DELETE CASCADE,
      visit_id UUID,
      note_type TEXT NOT NULL DEFAULT 'Progress Note',
      content TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  if (error && !error.message.includes('already exists')) {
    throw error;
  }

  // Enable RLS and create policies
  await supabase.rpc('exec_sql', { 
    sql: `
      ALTER TABLE ${NOTES_TABLE} ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow all operations" ON ${NOTES_TABLE}
      FOR ALL USING (true) WITH CHECK (true);
    ` 
  });
};

/**
 * Create patient visits table
 */
const createVisitsTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${VISITS_TABLE} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID REFERENCES ${PATIENTS_TABLE}(id) ON DELETE CASCADE,
      visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
      visit_type TEXT NOT NULL DEFAULT 'Check-up',
      chief_complaint TEXT,
      provider_id TEXT,
      department TEXT,
      status TEXT DEFAULT 'Scheduled',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  if (error && !error.message.includes('already exists')) {
    throw error;
  }

  // Enable RLS and create policies
  await supabase.rpc('exec_sql', { 
    sql: `
      ALTER TABLE ${VISITS_TABLE} ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow all operations" ON ${VISITS_TABLE}
      FOR ALL USING (true) WITH CHECK (true);
    ` 
  });
};

/**
 * Create patient vitals table
 */
const createVitalsTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${VITALS_TABLE} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID REFERENCES ${PATIENTS_TABLE}(id) ON DELETE CASCADE,
      visit_id UUID,
      temperature DECIMAL(4,1),
      heart_rate INTEGER,
      blood_pressure TEXT,
      respiratory_rate INTEGER,
      oxygen_saturation INTEGER,
      height DECIMAL(5,2),
      weight DECIMAL(5,2),
      bmi DECIMAL(4,1),
      recorded_by TEXT NOT NULL,
      recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  if (error && !error.message.includes('already exists')) {
    throw error;
  }

  // Enable RLS and create policies
  await supabase.rpc('exec_sql', { 
    sql: `
      ALTER TABLE ${VITALS_TABLE} ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow all operations" ON ${VITALS_TABLE}
      FOR ALL USING (true) WITH CHECK (true);
    ` 
  });
};

/**
 * Create prescriptions table
 */
const createPrescriptionsTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${PRESCRIPTIONS_TABLE} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID REFERENCES ${PATIENTS_TABLE}(id) ON DELETE CASCADE,
      visit_id UUID,
      medication TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      duration TEXT,
      start_date DATE NOT NULL,
      end_date DATE,
      instructions TEXT NOT NULL,
      refills INTEGER DEFAULT 0,
      refills_remaining INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Active',
      prescribed_by TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  if (error && !error.message.includes('already exists')) {
    throw error;
  }

  // Enable RLS and create policies
  await supabase.rpc('exec_sql', { 
    sql: `
      ALTER TABLE ${PRESCRIPTIONS_TABLE} ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow all operations" ON ${PRESCRIPTIONS_TABLE}
      FOR ALL USING (true) WITH CHECK (true);
    ` 
  });
};

/**
 * Insert sample patients for testing
 */
const insertSamplePatients = async () => {
  try {
    // Check if patients already exist
    const { data: existingPatients } = await supabase
      .from(PATIENTS_TABLE)
      .select('id')
      .limit(1);

    if (existingPatients && existingPatients.length > 0) {
      console.log('Sample patients already exist, skipping insertion');
      return;
    }

    const samplePatients = [
      {
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '1980-01-15',
        gender: 'Male',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
        address: '123 Main St, City, State 12345',
        blood_type: 'A+',
        allergies: ['Penicillin', 'Shellfish'],
        insurance_provider: 'Blue Cross',
        insurance_policy_number: 'BC123456',
        emergency_contact_name: 'Jane Doe',
        emergency_contact_phone: '+1 (555) 987-6543'
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        date_of_birth: '1992-05-20',
        gender: 'Female',
        phone: '+1 (555) 987-6543',
        email: 'jane.smith@example.com',
        address: '456 Oak Ave, City, State 12345',
        blood_type: 'B-',
        allergies: ['Latex'],
        insurance_provider: 'Aetna',
        insurance_policy_number: 'AE789012',
        emergency_contact_name: 'John Smith',
        emergency_contact_phone: '+1 (555) 123-4567'
      },
      {
        first_name: 'Bob',
        last_name: 'Johnson',
        date_of_birth: '1957-12-03',
        gender: 'Male',
        phone: '+1 (555) 456-7890',
        email: 'bob.johnson@example.com',
        address: '789 Pine Rd, City, State 12345',
        blood_type: 'O+',
        allergies: ['Aspirin'],
        insurance_provider: 'Medicare',
        insurance_policy_number: 'MC345678',
        emergency_contact_name: 'Alice Johnson',
        emergency_contact_phone: '+1 (555) 654-3210'
      }
    ];

    const { error } = await supabase
      .from(PATIENTS_TABLE)
      .insert(samplePatients);

    if (error) {
      console.error('Error inserting sample patients:', error);
    } else {
      console.log('Sample patients inserted successfully');
    }
  } catch (error) {
    console.error('Error in insertSamplePatients:', error);
  }
};

/**
 * Check if database is initialized
 */
export const checkDatabaseStatus = async () => {
  try {
    const { data, error } = await supabase
      .from(PATIENTS_TABLE)
      .select('id')
      .limit(1);

    if (error) {
      return { initialized: false, error: error.message };
    }

    return { initialized: true, hasData: data && data.length > 0 };
  } catch (error) {
    return { initialized: false, error: error.message };
  }
};