import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const DIAGNOSTIC_CODES_TABLE = 'diagnostic_codes_medlink_x7a9b2c3';
const VISIT_DIAGNOSES_TABLE = 'visit_diagnoses_medlink_x7a9b2c3';

// Mock data for development
const mockDiagnosticCodes = [
  { id: '1', code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', category: 'Endocrine' },
  { id: '2', code: 'I10', description: 'Essential (primary) hypertension', category: 'Circulatory' },
  { id: '3', code: 'J45.909', description: 'Unspecified asthma, uncomplicated', category: 'Respiratory' },
  { id: '4', code: 'M54.5', description: 'Low back pain', category: 'Musculoskeletal' },
  { id: '5', code: 'R51.9', description: 'Headache, unspecified', category: 'Symptoms' },
  { id: '6', code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis', category: 'Digestive' },
  { id: '7', code: 'F41.9', description: 'Anxiety disorder, unspecified', category: 'Mental' },
  { id: '8', code: 'N39.0', description: 'Urinary tract infection, site not specified', category: 'Genitourinary' },
  { id: '9', code: 'J02.9', description: 'Acute pharyngitis, unspecified', category: 'Respiratory' },
  { id: '10', code: 'L30.9', description: 'Dermatitis, unspecified', category: 'Skin' }
];

// Get all diagnostic codes
export const getAllDiagnosticCodes = async () => {
  try {
    // Check if table exists
    const { error: checkError } = await supabase
      .from(DIAGNOSTIC_CODES_TABLE)
      .select('id')
      .limit(1);

    // If table doesn't exist, return mock data
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Using mock diagnostic codes data');
      return { success: true, data: mockDiagnosticCodes };
    }

    // Otherwise fetch from database
    const { data, error } = await supabase
      .from(DIAGNOSTIC_CODES_TABLE)
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error getting diagnostic codes:', error);
    return { success: false, error: error.message, data: mockDiagnosticCodes };
  }
};

// Search diagnostic codes
export const searchDiagnosticCodes = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return { success: true, data: [] };
    }

    // Check if table exists
    const { error: checkError } = await supabase
      .from(DIAGNOSTIC_CODES_TABLE)
      .select('id')
      .limit(1);

    // If table doesn't exist, search mock data
    if (checkError && checkError.message.includes('does not exist')) {
      const term = searchTerm.toLowerCase();
      const results = mockDiagnosticCodes.filter(
        code => code.code.toLowerCase().includes(term) || 
                code.description.toLowerCase().includes(term)
      );
      return { success: true, data: results.slice(0, 10) };
    }

    // Otherwise search in database
    const { data, error } = await supabase
      .from(DIAGNOSTIC_CODES_TABLE)
      .select('*')
      .or(`code.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('code', { ascending: true })
      .limit(10);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error searching diagnostic codes:', error);
    
    // Fallback to mock data search
    const term = searchTerm.toLowerCase();
    const results = mockDiagnosticCodes.filter(
      code => code.code.toLowerCase().includes(term) || 
              code.description.toLowerCase().includes(term)
    );
    return { success: true, data: results.slice(0, 10) };
  }
};

// Add diagnostic code to visit
export const addDiagnosisToVisit = async (visitId, diagnosisData) => {
  try {
    const newDiagnosis = {
      id: uuidv4(),
      visit_id: visitId,
      diagnostic_code_id: diagnosisData.diagnosticCodeId,
      primary: diagnosisData.isPrimary || false,
      notes: diagnosisData.notes || '',
      created_at: new Date().toISOString(),
      created_by: diagnosisData.createdBy
    };

    // Check if table exists
    const { error: checkError } = await supabase
      .from(VISIT_DIAGNOSES_TABLE)
      .select('id')
      .limit(1);

    // If table doesn't exist, return mock success
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Mock diagnosis added:', newDiagnosis);
      return { success: true, data: newDiagnosis };
    }

    // Otherwise insert into database
    const { data, error } = await supabase
      .from(VISIT_DIAGNOSES_TABLE)
      .insert([newDiagnosis])
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding diagnosis to visit:', error);
    return { success: false, error: error.message };
  }
};

// Get diagnoses for a visit
export const getVisitDiagnoses = async (visitId) => {
  try {
    // Check if table exists
    const { error: checkError } = await supabase
      .from(VISIT_DIAGNOSES_TABLE)
      .select('id')
      .limit(1);

    // If table doesn't exist, return mock data
    if (checkError && checkError.message.includes('does not exist')) {
      // For mock data, we'll just create some sample diagnoses for the visit
      const mockDiagnoses = [
        {
          id: uuidv4(),
          visit_id: visitId,
          diagnostic_code_id: '2',
          diagnostic_code: mockDiagnosticCodes.find(c => c.id === '2'),
          primary: true,
          notes: 'Primary diagnosis',
          created_at: new Date().toISOString(),
          created_by: 'Dr. Smith'
        },
        {
          id: uuidv4(),
          visit_id: visitId,
          diagnostic_code_id: '5',
          diagnostic_code: mockDiagnosticCodes.find(c => c.id === '5'),
          primary: false,
          notes: 'Secondary diagnosis',
          created_at: new Date().toISOString(),
          created_by: 'Dr. Smith'
        }
      ];
      return { success: true, data: mockDiagnoses };
    }

    // Otherwise fetch from database with joined diagnostic code data
    const { data, error } = await supabase
      .from(VISIT_DIAGNOSES_TABLE)
      .select(`
        *,
        diagnostic_code:diagnostic_code_id (*)
      `)
      .eq('visit_id', visitId)
      .order('primary', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error getting visit diagnoses:', error);
    return { success: false, error: error.message };
  }
};

// Remove diagnosis from visit
export const removeDiagnosisFromVisit = async (diagnosisId) => {
  try {
    // Check if table exists
    const { error: checkError } = await supabase
      .from(VISIT_DIAGNOSES_TABLE)
      .select('id')
      .limit(1);

    // If table doesn't exist, return mock success
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Mock diagnosis removal for ID:', diagnosisId);
      return { success: true };
    }

    // Otherwise delete from database
    const { error } = await supabase
      .from(VISIT_DIAGNOSES_TABLE)
      .delete()
      .eq('id', diagnosisId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error removing diagnosis from visit:', error);
    return { success: false, error: error.message };
  }
};