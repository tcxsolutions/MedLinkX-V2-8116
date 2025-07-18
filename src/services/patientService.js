import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const PATIENTS_TABLE = 'patients_medlink_x7a9b2c3';
const NOTES_TABLE = 'patient_notes_medlink_x7a9b2c3';
const VISITS_TABLE = 'patient_visits_medlink_x7a9b2c3';
const VITALS_TABLE = 'patient_vitals_medlink_x7a9b2c3';
const PRESCRIPTIONS_TABLE = 'patient_prescriptions_medlink_x7a9b2c3';

// Get patient by ID
export const getPatientById = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(PATIENTS_TABLE)
      .select('*')
      .eq('id', patientId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting patient:', error);
    return { success: false, error: error.message };
  }
};

// Update patient
export const updatePatient = async (patientId, patientData) => {
  try {
    const { data, error } = await supabase
      .from(PATIENTS_TABLE)
      .update(patientData)
      .eq('id', patientId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: error.message };
  }
};

// Add patient note
export const addPatientNote = async (noteData) => {
  try {
    const newNote = {
      id: uuidv4(),
      ...noteData,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(NOTES_TABLE)
      .insert([newNote])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding note:', error);
    return { success: false, error: error.message };
  }
};

// Get patient notes
export const getPatientNotes = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(NOTES_TABLE)
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting patient notes:', error);
    return { success: false, error: error.message };
  }
};

// Get patient visits
export const getPatientVisits = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(VISITS_TABLE)
      .select(`
        *,
        diagnoses:visit_diagnoses_medlink_x7a9b2c3(
          *,
          diagnostic_code:diagnostic_code_id(*)
        )
      `)
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting patient visits:', error);
    return { success: false, error: error.message };
  }
};

// Create visit
export const createVisit = async (visitData) => {
  try {
    const newVisit = {
      id: uuidv4(),
      ...visitData,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(VISITS_TABLE)
      .insert([newVisit])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error creating visit:', error);
    return { success: false, error: error.message };
  }
};

// Update visit
export const updateVisit = async (visitId, visitData) => {
  try {
    const { data, error } = await supabase
      .from(VISITS_TABLE)
      .update(visitData)
      .eq('id', visitId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating visit:', error);
    return { success: false, error: error.message };
  }
};

// Get patient vitals
export const getPatientVitals = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(VITALS_TABLE)
      .select('*')
      .eq('patient_id', patientId)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting patient vitals:', error);
    return { success: false, error: error.message };
  }
};

// Record vitals
export const recordVitals = async (vitalsData) => {
  try {
    const newVitals = {
      id: uuidv4(),
      ...vitalsData,
      recorded_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(VITALS_TABLE)
      .insert([newVitals])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error recording vitals:', error);
    return { success: false, error: error.message };
  }
};

// Get patient prescriptions
export const getPatientPrescriptions = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(PRESCRIPTIONS_TABLE)
      .select('*')
      .eq('patient_id', patientId)
      .order('prescribed_date', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting patient prescriptions:', error);
    return { success: false, error: error.message };
  }
};

// Create prescription
export const createPrescription = async (prescriptionData) => {
  try {
    const newPrescription = {
      id: uuidv4(),
      ...prescriptionData,
      prescribed_date: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(PRESCRIPTIONS_TABLE)
      .insert([newPrescription])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: error.message };
  }
};

// Update prescription
export const updatePrescription = async (prescriptionId, prescriptionData) => {
  try {
    const { data, error } = await supabase
      .from(PRESCRIPTIONS_TABLE)
      .update(prescriptionData)
      .eq('id', prescriptionId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating prescription:', error);
    return { success: false, error: error.message };
  }
};

// Refill prescription
export const refillPrescription = async (prescriptionId) => {
  try {
    const { data: prescription, error: fetchError } = await supabase
      .from(PRESCRIPTIONS_TABLE)
      .select('*')
      .eq('id', prescriptionId)
      .single();

    if (fetchError) throw fetchError;

    const refillData = {
      ...prescription,
      id: uuidv4(),
      refill_of: prescriptionId,
      prescribed_date: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(PRESCRIPTIONS_TABLE)
      .insert([refillData])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error refilling prescription:', error);
    return { success: false, error: error.message };
  }
};

// Delete patient
export const deletePatient = async (patientId) => {
  try {
    const { error } = await supabase
      .from(PATIENTS_TABLE)
      .delete()
      .eq('id', patientId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: error.message };
  }
};