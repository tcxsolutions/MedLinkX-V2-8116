// Mock visit service that doesn't depend on Supabase
import { v4 as uuidv4 } from 'uuid';

// In-memory storage
const visits = [];
const progressNotes = [];
const vitals = [];
const dischargeSummaries = [];

// Create a new visit
export const createVisit = async (visitData) => {
  try {
    const newVisit = {
      ...visitData,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    visits.push(newVisit);
    
    return { success: true, data: newVisit };
  } catch (error) {
    console.error('Error creating visit:', error);
    return { success: false, error: error.message };
  }
};

// Get visit by ID with related data
export const getVisitById = async (visitId) => {
  try {
    const visit = visits.find(v => v.id === visitId);
    
    if (!visit) {
      return { success: false, error: 'Visit not found' };
    }
    
    // Get related data
    const visitNotes = progressNotes.filter(n => n.visit_id === visitId);
    const visitVitals = vitals.filter(v => v.visit_id === visitId);
    
    // Construct the response with related data
    const enrichedVisit = {
      ...visit,
      progress_notes_af245g6e7h: visitNotes,
      vitals_af245g6e7h: visitVitals
    };
    
    return { success: true, data: enrichedVisit };
  } catch (error) {
    console.error('Error getting visit:', error);
    return { success: false, error: error.message };
  }
};

// Update visit
export const updateVisit = async (visitId, visitData) => {
  try {
    const index = visits.findIndex(v => v.id === visitId);
    
    if (index === -1) {
      return { success: false, error: 'Visit not found' };
    }
    
    visits[index] = {
      ...visits[index],
      ...visitData,
      updated_at: new Date().toISOString()
    };
    
    return { success: true, data: visits[index] };
  } catch (error) {
    console.error('Error updating visit:', error);
    return { success: false, error: error.message };
  }
};

// List visits for a patient
export const listPatientVisits = async (patientId) => {
  try {
    const patientVisits = visits.filter(v => v.patient_id === patientId);
    
    // Sort by visit date descending
    patientVisits.sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));
    
    return { success: true, data: patientVisits };
  } catch (error) {
    console.error('Error listing patient visits:', error);
    return { success: false, error: error.message };
  }
};

// Add progress note to visit
export const addProgressNote = async (noteData) => {
  try {
    const newNote = {
      ...noteData,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    progressNotes.push(newNote);
    
    return { success: true, data: newNote };
  } catch (error) {
    console.error('Error adding progress note:', error);
    return { success: false, error: error.message };
  }
};

// Record vitals for visit
export const recordVitals = async (vitalsData) => {
  try {
    const newVitals = {
      ...vitalsData,
      id: uuidv4(),
      recorded_at: new Date().toISOString()
    };
    
    vitals.push(newVitals);
    
    return { success: true, data: newVitals };
  } catch (error) {
    console.error('Error recording vitals:', error);
    return { success: false, error: error.message };
  }
};

// Create discharge summary
export const createDischargeSummary = async (dischargeSummaryData) => {
  try {
    const newSummary = {
      ...dischargeSummaryData,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    dischargeSummaries.push(newSummary);
    
    return { success: true, data: newSummary };
  } catch (error) {
    console.error('Error creating discharge summary:', error);
    return { success: false, error: error.message };
  }
};

// List visits for schedule view (all patients)
export const listVisitsForSchedule = async (practiceId, startDate, endDate) => {
  try {
    // Filter visits by date range
    const filteredVisits = visits.filter(v => {
      const visitDate = new Date(v.visit_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return visitDate >= start && visitDate <= end;
    });
    
    // Sort by visit date ascending
    filteredVisits.sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date));
    
    return { success: true, data: filteredVisits };
  } catch (error) {
    console.error('Error listing visits for schedule:', error);
    return { success: false, error: error.message };
  }
};