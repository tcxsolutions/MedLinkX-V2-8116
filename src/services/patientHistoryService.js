import { supabase } from '../lib/supabase';
import { logAuditEvent } from './auditService';

const VACCINES_TABLE = 'patient_vaccines_medlink_x7a9b2c3';
const MEDICATIONS_HISTORY_TABLE = 'patient_medications_history_medlink_x7a9b2c3';
const SURGERIES_TABLE = 'patient_surgeries_medlink_x7a9b2c3';
const FAMILY_HISTORY_TABLE = 'patient_family_history_medlink_x7a9b2c3';
const PREVIOUS_DOCTORS_TABLE = 'patient_previous_doctors_medlink_x7a9b2c3';

// Vaccines
export const addVaccine = async (vaccineData, userId) => {
  try {
    const { data, error } = await supabase
      .from(VACCINES_TABLE)
      .insert([{ ...vaccineData, created_by: userId }])
      .select();

    if (error) throw error;

    await logAuditEvent({
      actionType: 'CREATE',
      tableName: VACCINES_TABLE,
      recordId: data[0].id,
      changes: vaccineData,
      userId
    });

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding vaccine:', error);
    return { success: false, error: error.message };
  }
};

export const getPatientVaccines = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(VACCINES_TABLE)
      .select('*')
      .eq('patient_id', patientId)
      .order('date_administered', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    return { success: false, error: error.message };
  }
};

// Medications History
export const addMedication = async (medicationData, userId) => {
  try {
    const { data, error } = await supabase
      .from(MEDICATIONS_HISTORY_TABLE)
      .insert([{ ...medicationData, created_by: userId }])
      .select();

    if (error) throw error;

    await logAuditEvent({
      actionType: 'CREATE',
      tableName: MEDICATIONS_HISTORY_TABLE,
      recordId: data[0].id,
      changes: medicationData,
      userId
    });

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding medication:', error);
    return { success: false, error: error.message };
  }
};

export const getPatientMedications = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(MEDICATIONS_HISTORY_TABLE)
      .select('*')
      .eq('patient_id', patientId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching medications:', error);
    return { success: false, error: error.message };
  }
};

// Surgeries
export const addSurgery = async (surgeryData, userId) => {
  try {
    const { data, error } = await supabase
      .from(SURGERIES_TABLE)
      .insert([{ ...surgeryData, created_by: userId }])
      .select();

    if (error) throw error;

    await logAuditEvent({
      actionType: 'CREATE',
      tableName: SURGERIES_TABLE,
      recordId: data[0].id,
      changes: surgeryData,
      userId
    });

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding surgery:', error);
    return { success: false, error: error.message };
  }
};

export const getPatientSurgeries = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(SURGERIES_TABLE)
      .select('*')
      .eq('patient_id', patientId)
      .order('surgery_date', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching surgeries:', error);
    return { success: false, error: error.message };
  }
};

// Family History
export const addFamilyHistory = async (historyData, userId) => {
  try {
    const { data, error } = await supabase
      .from(FAMILY_HISTORY_TABLE)
      .insert([{ ...historyData, created_by: userId }])
      .select();

    if (error) throw error;

    await logAuditEvent({
      actionType: 'CREATE',
      tableName: FAMILY_HISTORY_TABLE,
      recordId: data[0].id,
      changes: historyData,
      userId
    });

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding family history:', error);
    return { success: false, error: error.message };
  }
};

export const getPatientFamilyHistory = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(FAMILY_HISTORY_TABLE)
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching family history:', error);
    return { success: false, error: error.message };
  }
};

// Previous Doctors
export const addPreviousDoctor = async (doctorData, userId) => {
  try {
    const { data, error } = await supabase
      .from(PREVIOUS_DOCTORS_TABLE)
      .insert([{ ...doctorData, created_by: userId }])
      .select();

    if (error) throw error;

    await logAuditEvent({
      actionType: 'CREATE',
      tableName: PREVIOUS_DOCTORS_TABLE,
      recordId: data[0].id,
      changes: doctorData,
      userId
    });

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding previous doctor:', error);
    return { success: false, error: error.message };
  }
};

export const getPatientPreviousDoctors = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from(PREVIOUS_DOCTORS_TABLE)
      .select('*')
      .eq('patient_id', patientId)
      .order('end_date', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching previous doctors:', error);
    return { success: false, error: error.message };
  }
};