import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VoiceToTextInput from '../components/visits/VoiceToTextInput';
import DiagnosticCodeSelector from '../components/visits/DiagnosticCodeSelector';
import VisitDiagnosisList from '../components/visits/VisitDiagnosisList';
import * as FiIcons from 'react-icons/fi';
import { supabase } from '../lib/supabase';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [showAddVitals, setShowAddVitals] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Data states
  const [notes, setNotes] = useState([]);
  const [visits, setVisits] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnosticCodes, setDiagnosticCodes] = useState([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
  const [visitDiagnoses, setVisitDiagnoses] = useState({});
  
  // Form states
  const [editedPatient, setEditedPatient] = useState({});
  const [newNote, setNewNote] = useState({
    patient_id: id,
    note_type: 'Progress Note',
    content: '',
    created_by: 'Dr. Smith'
  });
  const [newVisit, setNewVisit] = useState({
    patient_id: id,
    visit_date: new Date().toISOString().split('T')[0],
    visit_type: 'Check-up',
    chief_complaint: '',
    provider_id: '',
    department: '',
    status: 'Scheduled'
  });
  const [newVitals, setNewVitals] = useState({
    patient_id: id,
    temperature: '',
    pulse: '',
    respiration_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    oxygen_saturation: '',
    height: '',
    weight: '',
    bmi: '',
    notes: '',
    recorded_by: 'Dr. Smith'
  });
  
  const [isUsingVoiceToText, setIsUsingVoiceToText] = useState(false);
  
  // Sample data for dropdowns
  const noteTypes = [
    'Progress Note',
    'Initial Assessment',
    'Follow-up',
    'Procedure Note',
    'Consultation',
    'Discharge Summary',
    'Phone Encounter'
  ];
  
  const doctors = [
    'Dr. Smith',
    'Dr. Johnson',
    'Dr. Brown',
    'Dr. Wilson',
    'Dr. Davis'
  ];

  // Fetch patient data
  useEffect(() => {
    fetchPatient();
    fetchNotes();
    fetchVisits();
    fetchVitals();
    fetchPrescriptions();
    fetchDiagnosticCodes();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('patients_medlink_x7a9b2c3')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setPatient(data);
        setEditedPatient(data);
      } else {
        // Use mock data if not found
        setPatient(getMockPatient());
        setEditedPatient(getMockPatient());
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to load patient data');
      setPatient(getMockPatient());
      setEditedPatient(getMockPatient());
    } finally {
      setLoading(false);
    }
  };

  const getMockPatient = () => {
    return {
      id,
      first_name: 'John',
      middle_name: 'A',
      last_name: 'Doe',
      date_of_birth: '1978-05-15',
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      address: '123 Main St, City, State 12345',
      blood_type: 'A+',
      allergies: ['Penicillin', 'Shellfish'],
      insurance_provider: 'Blue Cross',
      insurance_policy_number: 'BC12345678',
      emergency_contact_name: 'Jane Doe',
      emergency_contact_phone: '+1 (555) 987-6543'
    };
  };
  
  const fetchNotes = async () => {
    // Mock notes data
    const mockNotes = [
      {
        id: '1',
        patient_id: id,
        visit_id: null,
        note_type: 'Progress Note',
        content: 'Patient reports feeling better after starting new medication. Blood pressure is now 130/85, down from 140/90 last visit. Continue current medication regimen.',
        created_at: '2024-01-20T14:30:00Z',
        created_by: 'Dr. Smith'
      },
      {
        id: '2',
        patient_id: id,
        visit_id: null,
        note_type: 'Initial Assessment',
        content: 'Patient presents with symptoms of seasonal allergies. Prescribed Loratadine 10mg once daily. Advised to increase fluid intake and avoid outdoor activities during high pollen count days.',
        created_at: '2024-01-15T10:15:00Z',
        created_by: 'Dr. Johnson'
      }
    ];
    setNotes(mockNotes);
  };
  
  const fetchVisits = async () => {
    // Mock visits data
    const mockVisits = [
      {
        id: '1',
        patient_id: id,
        visit_date: '2024-01-20T09:00:00Z',
        visit_type: 'Check-up',
        chief_complaint: 'Regular check-up',
        provider_id: 'Dr. Smith',
        department: 'Family Medicine',
        status: 'Completed',
        created_at: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        patient_id: id,
        visit_date: '2024-01-10T14:30:00Z',
        visit_type: 'Sick Visit',
        chief_complaint: 'Persistent cough',
        provider_id: 'Dr. Johnson',
        department: 'Pulmonology',
        status: 'Completed',
        created_at: '2024-01-05T10:15:00Z'
      },
      {
        id: '3',
        patient_id: id,
        visit_date: '2024-01-30T11:00:00Z',
        visit_type: 'Follow-up',
        chief_complaint: 'Follow-up on medication',
        provider_id: 'Dr. Smith',
        department: 'Family Medicine',
        status: 'Scheduled',
        created_at: '2024-01-20T09:30:00Z'
      }
    ];
    setVisits(mockVisits);
  };
  
  const fetchVitals = async () => {
    // Mock vitals data
    const mockVitals = [
      {
        id: '1',
        patient_id: id,
        visit_id: '1',
        temperature: 37.0,
        pulse: 72,
        respiration_rate: 16,
        blood_pressure_systolic: 130,
        blood_pressure_diastolic: 85,
        oxygen_saturation: 98,
        height: 175,
        weight: 70,
        bmi: 22.9,
        notes: '',
        recorded_at: '2024-01-20T09:15:00Z',
        recorded_by: 'Nurse Johnson'
      },
      {
        id: '2',
        patient_id: id,
        visit_id: '2',
        temperature: 37.5,
        pulse: 80,
        respiration_rate: 18,
        blood_pressure_systolic: 135,
        blood_pressure_diastolic: 88,
        oxygen_saturation: 97,
        height: 175,
        weight: 70.5,
        bmi: 23.0,
        notes: 'Patient feeling fatigued',
        recorded_at: '2024-01-10T14:45:00Z',
        recorded_by: 'Nurse Williams'
      }
    ];
    setVitals(mockVitals);
  };
  
  const fetchPrescriptions = async () => {
    // Mock prescriptions data
    const mockPrescriptions = [
      {
        id: '1',
        patient_id: id,
        medication: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        start_date: '2024-01-20',
        end_date: '2024-04-20',
        refills: 3,
        refills_remaining: 2,
        status: 'Active',
        prescribed_by: 'Dr. Smith',
        instructions: 'Take with food in the morning'
      },
      {
        id: '2',
        patient_id: id,
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        start_date: '2024-01-10',
        end_date: '2024-01-17',
        refills: 0,
        refills_remaining: 0,
        status: 'Completed',
        prescribed_by: 'Dr. Johnson',
        instructions: 'Take until finished, even if symptoms improve'
      }
    ];
    setPrescriptions(mockPrescriptions);
  };
  
  const fetchDiagnosticCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('diagnostic_codes_medlink_x7a9b2c3')
        .select('*')
        .order('code');
        
      if (error) throw error;
      
      setDiagnosticCodes(data || []);
    } catch (error) {
      console.error('Error fetching diagnostic codes:', error);
      // Use mock data as fallback
      const mockCodes = [
        { id: '1', code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', category: 'Endocrine' },
        { id: '2', code: 'I10', description: 'Essential (primary) hypertension', category: 'Circulatory' },
        { id: '3', code: 'J45.909', description: 'Unspecified asthma, uncomplicated', category: 'Respiratory' },
        { id: '4', code: 'M54.5', description: 'Low back pain', category: 'Musculoskeletal' },
        { id: '5', code: 'R51.9', description: 'Headache, unspecified', category: 'Symptoms' }
      ];
      setDiagnosticCodes(mockCodes);
    }
  };

  // Load diagnoses for a visit
  const loadVisitDiagnoses = async (visitId) => {
    // Mock diagnoses for now
    const mockDiagnoses = [
      {
        id: '1',
        visit_id: visitId,
        diagnostic_code_id: '2',
        diagnostic_code: { id: '2', code: 'I10', description: 'Essential (primary) hypertension', category: 'Circulatory' },
        primary: true,
        notes: 'Primary diagnosis',
        created_at: '2024-01-20T09:30:00Z',
        created_by: 'Dr. Smith'
      },
      {
        id: '2',
        visit_id: visitId,
        diagnostic_code_id: '5',
        diagnostic_code: { id: '5', code: 'R51.9', description: 'Headache, unspecified', category: 'Symptoms' },
        primary: false,
        notes: 'Secondary diagnosis',
        created_at: '2024-01-20T09:35:00Z',
        created_by: 'Dr. Smith'
      }
    ];
    
    setVisitDiagnoses({
      ...visitDiagnoses,
      [visitId]: mockDiagnoses
    });
  };

  // Handle adding a diagnosis to a visit
  const handleAddDiagnosisToVisit = async (visitId, diagnosisData) => {
    try {
      // In a real app, this would be an API call
      const newDiagnosis = {
        id: Date.now().toString(),
        visit_id: visitId,
        diagnostic_code_id: diagnosisData.diagnosticCodeId,
        diagnostic_code: diagnosticCodes.find(code => code.id === diagnosisData.diagnosticCodeId),
        primary: diagnosisData.isPrimary || false,
        notes: diagnosisData.notes || '',
        created_at: new Date().toISOString(),
        created_by: 'Current User'
      };
      
      // Add to state
      setVisitDiagnoses({
        ...visitDiagnoses,
        [visitId]: [...(visitDiagnoses[visitId] || []), newDiagnosis]
      });
      
      toast.success('Diagnosis added successfully');
      return { success: true };
    } catch (error) {
      console.error('Error adding diagnosis:', error);
      toast.error('Failed to add diagnosis');
      return { success: false, error: error.message };
    }
  };

  // Handle removing a diagnosis from a visit
  const handleRemoveDiagnosisFromVisit = async (diagnosisId, visitId) => {
    try {
      // In a real app, this would be an API call
      // Update state
      setVisitDiagnoses({
        ...visitDiagnoses,
        [visitId]: visitDiagnoses[visitId].filter(d => d.id !== diagnosisId)
      });
      
      toast.success('Diagnosis removed successfully');
      return { success: true };
    } catch (error) {
      console.error('Error removing diagnosis:', error);
      toast.error('Failed to remove diagnosis');
      return { success: false, error: error.message };
    }
  };

  // Handle adding a new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call
      const newNoteData = {
        id: Date.now().toString(),
        ...newNote,
        created_at: new Date().toISOString()
      };
      
      // Add to state
      setNotes([newNoteData, ...notes]);
      
      // Reset form and close modal
      setShowAddNote(false);
      setNewNote({
        patient_id: id,
        note_type: 'Progress Note',
        content: '',
        created_by: 'Dr. Smith'
      });
      
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  // Handle scheduling a new visit
  const handleAddVisit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call
      const newVisitData = {
        id: Date.now().toString(),
        ...newVisit,
        created_at: new Date().toISOString()
      };
      
      // Add to state
      setVisits([newVisitData, ...visits]);
      
      // Reset form and close modal
      setShowAddVisit(false);
      setNewVisit({
        patient_id: id,
        visit_date: new Date().toISOString().split('T')[0],
        visit_type: 'Check-up',
        chief_complaint: '',
        provider_id: '',
        department: '',
        status: 'Scheduled'
      });
      
      toast.success('Visit scheduled successfully');
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast.error('Failed to schedule visit');
    }
  };

  // Handle recording vitals
  const handleAddVitals = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call
      const newVitalsData = {
        id: Date.now().toString(),
        ...newVitals,
        recorded_at: new Date().toISOString()
      };
      
      // Add to state
      setVitals([newVitalsData, ...vitals]);
      
      // Reset form and close modal
      setShowAddVitals(false);
      setNewVitals({
        patient_id: id,
        temperature: '',
        pulse: '',
        respiration_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        oxygen_saturation: '',
        height: '',
        weight: '',
        bmi: '',
        notes: '',
        recorded_by: 'Dr. Smith'
      });
      
      toast.success('Vitals recorded successfully');
    } catch (error) {
      console.error('Error recording vitals:', error);
      toast.error('Failed to record vitals');
    }
  };

  // Handle updating patient information
  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      // Convert allergies array to string if needed
      let updatedPatient = { ...editedPatient };
      
      if (typeof updatedPatient.allergies === 'string') {
        updatedPatient.allergies = updatedPatient.allergies
          .split(',')
          .map(a => a.trim())
          .filter(a => a);
      }
      
      // In a real app, this would be an API call
      const { data, error } = await supabase
        .from('patients_medlink_x7a9b2c3')
        .update(updatedPatient)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      // Update state
      if (data && data[0]) {
        setPatient(data[0]);
      }
      
      // Close modal
      setShowEditPatient(false);
      toast.success('Patient information updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient information');
    }
  };

  // Handle deleting a patient
  const handleDeletePatient = async () => {
    try {
      // In a real app, this would be an API call
      const { error } = await supabase
        .from('patients_medlink_x7a9b2c3')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Patient deleted successfully');
      navigate('/patients');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };

  // Helper function to handle field changes in the edit form
  const handleFieldChange = (field, value) => {
    setEditedPatient({ ...editedPatient, [field]: value });
  };

  // Helper function to format a date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format a datetime
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Handle voice-to-text toggle
  const handleVoiceToTextToggle = () => {
    setIsUsingVoiceToText(!isUsingVoiceToText);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Patient Not Found</h2>
          <p className="text-red-700 mb-6">
            The patient you are looking for could not be found or has been deleted.
          </p>
          <Link
            to="/patients"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
          >
            <SafeIcon icon={FiIcons.FiArrowLeft} className="w-4 h-4" />
            <span>Back to Patients</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Patient Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {patient.first_name && patient.first_name[0]}
                {patient.last_name && patient.last_name[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.first_name} {patient.middle_name} {patient.last_name}
                </h1>
                {patient.status && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800">
                    {patient.status}
                  </span>
                )}
              </div>
              <div className="text-gray-600 flex flex-wrap gap-x-4 mt-1">
                <span>
                  {calculateAge(patient.date_of_birth)} years • {patient.gender}
                </span>
                {patient.blood_type && <span>Blood Type: {patient.blood_type}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddNote(true)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1 text-sm"
            >
              <SafeIcon icon={FiIcons.FiFileText} className="w-4 h-4" />
              <span>Add Note</span>
            </button>
            <button
              onClick={() => setShowAddVisit(true)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1 text-sm"
            >
              <SafeIcon icon={FiIcons.FiCalendar} className="w-4 h-4" />
              <span>Schedule Visit</span>
            </button>
            <button
              onClick={() => setShowAddVitals(true)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1 text-sm"
            >
              <SafeIcon icon={FiIcons.FiActivity} className="w-4 h-4" />
              <span>Record Vitals</span>
            </button>
            <button
              onClick={() => setShowEditPatient(true)}
              className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-1 text-sm"
            >
              <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
              <span>Edit Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiUser} className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'visits'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiCalendar} className="w-4 h-4" />
            <span>Visits</span>
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vitals'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiActivity} className="w-4 h-4" />
            <span>Vitals</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiFileText} className="w-4 h-4" />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prescriptions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiList} className="w-4 h-4" />
            <span>Prescriptions</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient Information */}
            <Card title="Patient Information">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Full Name:</span>
                  <span className="font-medium">
                    {patient.first_name} {patient.middle_name} {patient.last_name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date of Birth:</span>
                  <span className="font-medium">{formatDate(patient.date_of_birth)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gender:</span>
                  <span className="font-medium">{patient.gender}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Blood Type:</span>
                  <span className="font-medium">{patient.blood_type || 'Not provided'}</span>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card title="Contact Information">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{patient.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{patient.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium text-right">{patient.address || 'Not provided'}</span>
                </div>
              </div>
            </Card>

            {/* Insurance & Emergency Contact */}
            <Card title="Insurance & Emergency Contact">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Insurance Provider:</span>
                  <span className="font-medium">{patient.insurance_provider || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Policy Number:</span>
                  <span className="font-medium">{patient.insurance_policy_number || 'Not provided'}</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Emergency Contact:</span>
                  <span className="font-medium">{patient.emergency_contact_name || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Emergency Phone:</span>
                  <span className="font-medium">{patient.emergency_contact_phone || 'Not provided'}</span>
                </div>
              </div>
            </Card>

            {/* Allergies */}
            <Card title="Allergies">
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="space-y-2">
                  {patient.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-900">{allergy}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No known allergies</p>
              )}
            </Card>

            {/* Recent Visits */}
            <Card
              title="Recent Visits"
              actions={
                <Link
                  to="#"
                  onClick={() => setActiveTab('visits')}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  View All
                </Link>
              }
            >
              {visits.length > 0 ? (
                <div className="space-y-3">
                  {visits.slice(0, 3).map((visit) => (
                    <div
                      key={visit.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{visit.visit_type}</p>
                          <p className="text-sm text-gray-600">{formatDateTime(visit.visit_date)}</p>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            visit.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : visit.status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {visit.status}
                        </span>
                      </div>
                      {visit.provider_id && (
                        <p className="text-sm text-gray-500 mt-2">Provider: {visit.provider_id}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No visits recorded</p>
              )}
            </Card>

            {/* Recent Vitals */}
            <Card
              title="Recent Vitals"
              actions={
                <Link
                  to="#"
                  onClick={() => setActiveTab('vitals')}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  View All
                </Link>
              }
            >
              {vitals.length > 0 ? (
                <div className="space-y-3">
                  {vitals.slice(0, 1).map((vital) => (
                    <div key={vital.id} className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Recorded on {formatDateTime(vital.recorded_at)}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">Temperature</p>
                          <p className="font-medium">{vital.temperature}°C</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">Pulse</p>
                          <p className="font-medium">{vital.pulse} bpm</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">Blood Pressure</p>
                          <p className="font-medium">
                            {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic} mmHg
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">Oxygen Saturation</p>
                          <p className="font-medium">{vital.oxygen_saturation}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No vitals recorded</p>
              )}
            </Card>

            {/* Recent Notes */}
            <Card
              title="Recent Notes"
              actions={
                <Link
                  to="#"
                  onClick={() => setActiveTab('notes')}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  View All
                </Link>
              }
            >
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.slice(0, 1).map((note) => (
                    <div key={note.id} className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">{note.note_type}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(note.created_at)}</p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
                      <p className="text-xs text-gray-500">By: {note.created_by}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No notes recorded</p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'visits' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Patient Visits</h2>
              <button
                onClick={() => setShowAddVisit(true)}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Schedule Visit</span>
              </button>
            </div>

            {visits.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={FiIcons.FiCalendar} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Visits Recorded</h3>
                  <p className="text-gray-600 mb-6">This patient has no visit history.</p>
                  <button
                    onClick={() => setShowAddVisit(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Schedule First Visit
                  </button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => {
                  // Load diagnoses if not already loaded
                  if (!visitDiagnoses[visit.id]) {
                    loadVisitDiagnoses(visit.id);
                  }
                  
                  const visitDiagnosesData = visitDiagnoses[visit.id] || [];
                  
                  return (
                    <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{visit.visit_type}</h4>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                visit.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : visit.status === 'Scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : visit.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {visit.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDateTime(visit.visit_date)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              // Edit visit functionality would go here
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600"
                          >
                            <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        {visit.provider_id && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <SafeIcon icon={FiIcons.FiUser} className="w-4 h-4" />
                            <span>Provider: {visit.provider_id}</span>
                          </div>
                        )}
                        {visit.department && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <SafeIcon icon={FiIcons.FiBriefcase} className="w-4 h-4" />
                            <span>Department: {visit.department}</span>
                          </div>
                        )}
                      </div>
                      {visit.chief_complaint && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Chief Complaint:</p>
                          <p className="text-sm text-gray-800">{visit.chief_complaint}</p>
                        </div>
                      )}
                      {/* Diagnoses Section */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-700">Diagnoses:</p>
                          {visit.status !== 'Cancelled' && (
                            <button
                              onClick={() => {
                                // Load diagnoses if not already loaded
                                if (!visitDiagnoses[visit.id]) {
                                  loadVisitDiagnoses(visit.id);
                                }
                                // Handle adding diagnosis here
                              }}
                              className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
                            >
                              <SafeIcon icon={FiIcons.FiPlus} className="w-3 h-3 mr-1" />
                              Add Diagnosis
                            </button>
                          )}
                        </div>
                        {/* Display diagnoses if loaded */}
                        {visitDiagnosesData.length > 0 ? (
                          <div className="pl-2 border-l-2 border-blue-300">
                            <VisitDiagnosisList
                              diagnoses={visitDiagnosesData}
                              onRemove={(diagId) => handleRemoveDiagnosisFromVisit(diagId, visit.id)}
                              readOnly={visit.status === 'Cancelled'}
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No diagnoses recorded</p>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2 pt-3 border-t">
                        {visit.status === 'Scheduled' && (
                          <>
                            <button
                              onClick={() => {
                                // Update visit status to Completed
                                const updatedVisit = { ...visit, status: 'Completed' };
                                setVisits(
                                  visits.map((v) => (v.id === visit.id ? updatedVisit : v))
                                );
                                toast.success('Visit marked as completed');
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => {
                                // Update visit status to Cancelled
                                const updatedVisit = { ...visit, status: 'Cancelled' };
                                setVisits(
                                  visits.map((v) => (v.id === visit.id ? updatedVisit : v))
                                );
                                toast.success('Visit cancelled');
                              }}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {/* Add vitals button */}
                        <button
                          onClick={() => {
                            setNewVitals({ ...newVitals, visit_id: visit.id });
                            setShowAddVitals(true);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Record Vitals
                        </button>
                        {/* Add note button */}
                        <button
                          onClick={() => {
                            setNewNote({ ...newNote, visit_id: visit.id });
                            setShowAddNote(true);
                          }}
                          className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Patient Vitals</h2>
              <button
                onClick={() => setShowAddVitals(true)}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Record Vitals</span>
              </button>
            </div>

            {vitals.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={FiIcons.FiActivity} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Vitals Recorded</h3>
                  <p className="text-gray-600 mb-6">This patient has no vital signs recorded.</p>
                  <button
                    onClick={() => setShowAddVitals(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Record First Vitals
                  </button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {vitals.map((vital) => (
                  <Card key={vital.id}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Vitals on {formatDateTime(vital.recorded_at)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Recorded by: {vital.recorded_by}
                          {vital.visit_id && ` • Visit ID: ${vital.visit_id}`}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="font-medium text-gray-900">{vital.temperature}°C</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Pulse</p>
                        <p className="font-medium text-gray-900">{vital.pulse} bpm</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Respiration Rate</p>
                        <p className="font-medium text-gray-900">{vital.respiration_rate} bpm</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="font-medium text-gray-900">
                          {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic} mmHg
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Oxygen Saturation</p>
                        <p className="font-medium text-gray-900">{vital.oxygen_saturation}%</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Height</p>
                        <p className="font-medium text-gray-900">{vital.height} cm</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="font-medium text-gray-900">{vital.weight} kg</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">BMI</p>
                        <p className="font-medium text-gray-900">{vital.bmi}</p>
                      </div>
                    </div>
                    {vital.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Notes</p>
                        <p className="text-sm text-gray-900">{vital.notes}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Clinical Notes</h2>
              <button
                onClick={() => setShowAddNote(true)}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Add Note</span>
              </button>
            </div>

            {notes.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={FiIcons.FiFileText} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Clinical Notes</h3>
                  <p className="text-gray-600 mb-6">This patient has no clinical notes recorded.</p>
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add First Note
                  </button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{note.note_type}</h3>
                        <p className="text-sm text-gray-600">
                          By: {note.created_by} on {formatDateTime(note.created_at)}
                          {note.visit_id && ` • Visit ID: ${note.visit_id}`}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-line">{note.content}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Prescriptions</h2>
              <button
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                onClick={() => {
                  // Navigate to prescriptions page or open modal
                  navigate('/prescriptions');
                }}
              >
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Add Prescription</span>
              </button>
            </div>

            {prescriptions.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={FiIcons.FiList} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions</h3>
                  <p className="text-gray-600 mb-6">This patient has no prescriptions recorded.</p>
                  <Link
                    to="/prescriptions"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add First Prescription
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <Card key={prescription.id}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {prescription.medication} {prescription.dosage}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Prescribed by: {prescription.prescribed_by} on{' '}
                          {formatDate(prescription.start_date)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          prescription.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {prescription.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Frequency</p>
                        <p className="font-medium">{prescription.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">
                          {formatDate(prescription.start_date)} to{' '}
                          {formatDate(prescription.end_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Refills</p>
                        <p className="font-medium">
                          {prescription.refills_remaining} of {prescription.refills}
                        </p>
                      </div>
                    </div>
                    {prescription.instructions && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Instructions</p>
                        <p className="text-sm text-gray-800">{prescription.instructions}</p>
                      </div>
                    )}
                    {prescription.status === 'Active' && prescription.refills_remaining > 0 && (
                      <div className="mt-4 flex justify-end">
                        <button className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                          Refill
                        </button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      <Modal
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        title="Add Clinical Note"
        size="lg"
      >
        <form onSubmit={handleAddNote} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note Type</label>
              <select
                value={newNote.note_type}
                onChange={(e) => setNewNote({ ...newNote, note_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {noteTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider Name
              </label>
              <select
                value={newNote.created_by}
                onChange={(e) => setNewNote({ ...newNote, created_by: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {doctors.map((doctor, index) => (
                  <option key={index} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Clinical Note
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleVoiceToTextToggle}
                  className={`px-3 py-1 text-xs rounded-full flex items-center space-x-1 ${
                    isUsingVoiceToText
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <SafeIcon icon={FiIcons.FiMic} className="w-3 h-3" />
                  <span>{isUsingVoiceToText ? 'Using Voice' : 'Use Voice'}</span>
                </button>
              </div>
            </div>
            {isUsingVoiceToText ? (
              <VoiceToTextInput
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
                placeholder="Speak or type your clinical observations, assessment, and plan..."
              />
            ) : (
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter clinical observations, assessment, and plan..."
                required
              ></textarea>
            )}
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddNote(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Note
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Visit Modal */}
      <Modal
        isOpen={showAddVisit}
        onClose={() => setShowAddVisit(false)}
        title="Schedule Visit"
        size="lg"
      >
        <form onSubmit={handleAddVisit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit Date *
              </label>
              <input
                type="date"
                value={newVisit.visit_date}
                onChange={(e) => setNewVisit({ ...newVisit, visit_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit Type *
              </label>
              <select
                value={newVisit.visit_type}
                onChange={(e) => setNewVisit({ ...newVisit, visit_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="Check-up">Check-up</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Sick Visit">Sick Visit</option>
                <option value="Physical Exam">Physical Exam</option>
                <option value="Consultation">Consultation</option>
                <option value="Procedure">Procedure</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Urgent Care">Urgent Care</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider
              </label>
              <select
                value={newVisit.provider_id}
                onChange={(e) => setNewVisit({ ...newVisit, provider_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Provider</option>
                {doctors.map((doctor, index) => (
                  <option key={index} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={newVisit.department}
                onChange={(e) => setNewVisit({ ...newVisit, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                <option value="Family Medicine">Family Medicine</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Radiology">Radiology</option>
                <option value="Surgery">Surgery</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chief Complaint *
            </label>
            <textarea
              value={newVisit.chief_complaint}
              onChange={(e) => setNewVisit({ ...newVisit, chief_complaint: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe the main reason for the visit"
              required
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddVisit(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Schedule Visit
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Vitals Modal */}
      <Modal
        isOpen={showAddVitals}
        onClose={() => setShowAddVitals(false)}
        title="Record Vitals"
        size="lg"
      >
        <form onSubmit={handleAddVitals} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={newVitals.temperature}
                onChange={(e) => setNewVitals({ ...newVitals, temperature: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="36.5 - 37.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pulse (bpm)
              </label>
              <input
                type="number"
                value={newVitals.pulse}
                onChange={(e) => setNewVitals({ ...newVitals, pulse: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="60 - 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respiration Rate (bpm)
              </label>
              <input
                type="number"
                value={newVitals.respiration_rate}
                onChange={(e) => setNewVitals({ ...newVitals, respiration_rate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="12 - 20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BP Systolic (mmHg)
              </label>
              <input
                type="number"
                value={newVitals.blood_pressure_systolic}
                onChange={(e) =>
                  setNewVitals({ ...newVitals, blood_pressure_systolic: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="90 - 140"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BP Diastolic (mmHg)
              </label>
              <input
                type="number"
                value={newVitals.blood_pressure_diastolic}
                onChange={(e) =>
                  setNewVitals({ ...newVitals, blood_pressure_diastolic: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="60 - 90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O2 Saturation (%)
              </label>
              <input
                type="number"
                value={newVitals.oxygen_saturation}
                onChange={(e) => setNewVitals({ ...newVitals, oxygen_saturation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="95 - 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={newVitals.height}
                onChange={(e) => setNewVitals({ ...newVitals, height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={newVitals.weight}
                onChange={(e) => {
                  const weight = parseFloat(e.target.value);
                  const height = parseFloat(newVitals.height);
                  let bmi = '';
                  
                  if (weight && height) {
                    // Calculate BMI: weight (kg) / (height (m))²
                    const heightInMeters = height / 100;
                    bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
                  }
                  
                  setNewVitals({ 
                    ...newVitals, 
                    weight: e.target.value,
                    bmi
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BMI
              </label>
              <input
                type="number"
                step="0.1"
                value={newVitals.bmi}
                onChange={(e) => setNewVitals({ ...newVitals, bmi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={newVitals.notes}
              onChange={(e) => setNewVitals({ ...newVitals, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional observations or notes about the patient's condition"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddVitals(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Record Vitals
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEditPatient}
        onClose={() => setShowEditPatient(false)}
        title="Edit Patient Information"
        size="lg"
      >
        <form onSubmit={handleUpdatePatient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={editedPatient.first_name || ''}
                onChange={(e) => handleFieldChange('first_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                value={editedPatient.middle_name || ''}
                onChange={(e) => handleFieldChange('middle_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={editedPatient.last_name || ''}
                onChange={(e) => handleFieldChange('last_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={editedPatient.date_of_birth || ''}
                onChange={(e) => handleFieldChange('date_of_birth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={editedPatient.gender || ''}
                onChange={(e) => handleFieldChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              <select
                value={editedPatient.blood_type || ''}
                onChange={(e) => handleFieldChange('blood_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={editedPatient.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editedPatient.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={editedPatient.address || ''}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies
            </label>
            <input
              type="text"
              value={
                Array.isArray(editedPatient.allergies)
                  ? editedPatient.allergies.join(', ')
                  : editedPatient.allergies || ''
              }
              onChange={(e) => handleFieldChange('allergies', e.target.value)}
              placeholder="Separate multiple allergies with commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Provider
              </label>
              <input
                type="text"
                value={editedPatient.insurance_provider || ''}
                onChange={(e) => handleFieldChange('insurance_provider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Policy Number
              </label>
              <input
                type="text"
                value={editedPatient.insurance_policy_number || ''}
                onChange={(e) => handleFieldChange('insurance_policy_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={editedPatient.emergency_contact_name || ''}
                onChange={(e) => handleFieldChange('emergency_contact_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={editedPatient.emergency_contact_phone || ''}
                onChange={(e) => handleFieldChange('emergency_contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
            >
              <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
              <span>Delete Patient</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowEditPatient(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <div className="flex items-start">
              <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-5 h-5 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium">Delete Patient Record?</h4>
                <p className="text-sm mt-1">
                  This action cannot be undone. All data associated with this patient will be
                  permanently deleted.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center p-3 border border-gray-200 rounded-lg">
            <p className="font-medium">
              {patient.first_name} {patient.last_name}
            </p>
            <p className="text-sm text-gray-500">
              {patient.email || patient.phone || 'No contact information'}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePatient}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Patient
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PatientDetails;