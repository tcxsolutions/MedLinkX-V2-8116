// Mock prescription service that doesn't depend on Supabase
import { v4 as uuidv4 } from 'uuid';

// In-memory storage
const medications = [
  { id: '1', name: 'Lisinopril', generic_name: 'Lisinopril', form: 'Tablet', strength: '10mg' },
  { id: '2', name: 'Metformin', generic_name: 'Metformin HCl', form: 'Tablet', strength: '500mg' },
  { id: '3', name: 'Atorvastatin', generic_name: 'Atorvastatin Calcium', form: 'Tablet', strength: '20mg' },
  { id: '4', name: 'Amoxicillin', generic_name: 'Amoxicillin', form: 'Capsule', strength: '500mg' }
];

const prescriptions = [];
const interactions = [
  { 
    id: '1', 
    medication_id_1: '1', 
    medication_id_2: '2',
    severity: 'moderate',
    description: 'May cause hypoglycemia',
    recommendation: 'Monitor blood glucose levels'
  }
];

// Get all medications
export const getAllMedications = async () => {
  try {
    return { success: true, data: medications };
  } catch (error) {
    console.error('Error getting medications:', error);
    return { success: false, error: error.message };
  }
};

// Search medications
export const searchMedications = async (searchTerm) => {
  try {
    const term = searchTerm.toLowerCase();
    
    const results = medications.filter(med => 
      med.name.toLowerCase().includes(term) || 
      med.generic_name.toLowerCase().includes(term)
    );
    
    return { success: true, data: results.slice(0, 10) };
  } catch (error) {
    console.error('Error searching medications:', error);
    return { success: false, error: error.message };
  }
};

// Create new prescription
export const createPrescription = async (prescriptionData) => {
  try {
    const newPrescription = {
      ...prescriptionData,
      id: uuidv4(),
      prescribed_date: new Date().toISOString(),
      status: 'Active'
    };
    
    prescriptions.push(newPrescription);
    
    return { success: true, data: newPrescription };
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: error.message };
  }
};

// Get patient prescriptions
export const getPatientPrescriptions = async (patientId) => {
  try {
    const patientPrescriptions = prescriptions.filter(rx => rx.patient_id === patientId);
    
    // Sort by prescribed date descending
    patientPrescriptions.sort((a, b) => new Date(b.prescribed_date) - new Date(a.prescribed_date));
    
    // Add medication details to each prescription
    const enrichedPrescriptions = patientPrescriptions.map(rx => {
      const medication = medications.find(m => m.id === rx.medication_id);
      
      return {
        ...rx,
        medications_af245g6e7h: medication
      };
    });
    
    return { success: true, data: enrichedPrescriptions };
  } catch (error) {
    console.error('Error getting patient prescriptions:', error);
    return { success: false, error: error.message };
  }
};

// Update prescription status
export const updatePrescriptionStatus = async (prescriptionId, status) => {
  try {
    const index = prescriptions.findIndex(rx => rx.id === prescriptionId);
    
    if (index === -1) {
      return { success: false, error: 'Prescription not found' };
    }
    
    prescriptions[index] = {
      ...prescriptions[index],
      status,
      updated_at: new Date().toISOString()
    };
    
    return { success: true, data: prescriptions[index] };
  } catch (error) {
    console.error('Error updating prescription status:', error);
    return { success: false, error: error.message };
  }
};

// Check for drug interactions
export const checkDrugInteractions = async (medicationId, patientId) => {
  try {
    // Get patient's active medications
    const activeRx = prescriptions.filter(rx => 
      rx.patient_id === patientId && 
      rx.status === 'Active'
    );
    
    if (activeRx.length === 0) {
      return { success: true, interactions: [] };
    }
    
    const activeMedicationIds = activeRx.map(rx => rx.medication_id);
    
    // Find interactions
    const foundInteractions = interactions.filter(interaction => 
      (interaction.medication_id_1 === medicationId && activeMedicationIds.includes(interaction.medication_id_2)) ||
      (interaction.medication_id_2 === medicationId && activeMedicationIds.includes(interaction.medication_id_1))
    );
    
    // Add medication names to interactions
    const enrichedInteractions = foundInteractions.map(interaction => {
      const med1 = medications.find(m => m.id === interaction.medication_id_1);
      const med2 = medications.find(m => m.id === interaction.medication_id_2);
      
      return {
        ...interaction,
        medications_af245g6e7h_medication_interactions_af245g6e7h_medication_id_1_fkey: { name: med1?.name },
        medications_af245g6e7h_medication_interactions_af245g6e7h_medication_id_2_fkey: { name: med2?.name }
      };
    });
    
    return { success: true, interactions: enrichedInteractions };
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    return { success: false, error: error.message };
  }
};