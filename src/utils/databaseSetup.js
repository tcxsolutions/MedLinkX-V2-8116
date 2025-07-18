// Update the table creation function in databaseSetup.js
const createPatientsTable = async () => {
  try {
    // First check if the table exists
    const { error: checkError } = await supabase
      .from('patients_medlink_x7a9b2c3')
      .select('id')
      .limit(1)
      .single();

    // If we get a "relation does not exist" error, create the table
    if (checkError?.message?.includes('relation "patients_medlink_x7a9b2c3" does not exist')) {
      const { error } = await supabase.rpc('create_patients_table', {
        table_name: 'patients_medlink_x7a9b2c3'
      });

      if (error && !error.message?.includes('already exists')) {
        console.error('Error creating patients table:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in createPatientsTable:', error);
    // Continue execution even if there's an error
  }
};