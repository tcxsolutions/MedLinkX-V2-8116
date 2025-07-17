import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';
import { 
  getPatientById, 
  updatePatient, 
  addPatientNote, 
  getPatientNotes, 
  getPatientVisits, 
  createVisit, 
  updateVisit,
  getPatientVitals,
  recordVitals,
  getPatientPrescriptions,
  createPrescription,
  updatePrescription,
  refillPrescription,
  deletePatient
} from '../services/patientService';
import { format, parseISO } from 'date-fns';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Modal states
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [showEditVisit, setShowEditVisit] = useState(false);
  const [showAddVitals, setShowAddVitals] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
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
    visit_date: new Date().toISOString(),
    visit_type: 'Check-up',
    chief_complaint: '',
    provider_id: '',
    department: '',
    status: 'Scheduled'
  });
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [newVitals, setNewVitals] = useState({
    patient_id: id,
    temperature: '',
    heart_rate: '',
    blood_pressure: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    height: '',
    weight: '',
    recorded_by: 'Dr. Smith'
  });
  const [newPrescription, setNewPrescription] = useState({
    patient_id: id,
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    start_date: new Date().toISOString().split('T')[0],
    instructions: '',
    refills: 0,
    prescribed_by: 'Dr. Smith'
  });
  
  // Data states
  const [notes, setNotes] = useState([]);
  const [visits, setVisits] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  
  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        
        // Get patient details
        const patientResult = await getPatientById(id);
        if (!patientResult.success) {
          throw new Error(patientResult.error || 'Failed to fetch patient details');
        }
        
        setPatient(patientResult.data);
        setEditedPatient(patientResult.data);
        
        // Get patient notes
        const notesResult = await getPatientNotes(id);
        if (notesResult.success) {
          setNotes(notesResult.data);
        }
        
        // Get patient visits
        const visitsResult = await getPatientVisits(id);
        if (visitsResult.success) {
          setVisits(visitsResult.data);
        }
        
        // Get patient vitals
        const vitalsResult = await getPatientVitals(id);
        if (vitalsResult.success) {
          setVitals(vitalsResult.data);
        }
        
        // Get patient prescriptions
        const prescriptionsResult = await getPatientPrescriptions(id);
        if (prescriptionsResult.success) {
          setPrescriptions(prescriptionsResult.data);
        }
      } catch (error) {
        toast.error(error.message);
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [id]);
  
  const handleSavePatient = async () => {
    try {
      const result = await updatePatient(id, editedPatient);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update patient');
      }
      
      setPatient(result.data);
      setEditMode(false);
      toast.success('Patient information updated successfully');
    } catch (error) {
      toast.error(error.message);
      console.error('Error updating patient:', error);
    }
  };
  
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const result = await addPatientNote(newNote);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add note');
      }
      
      setNotes([result.data, ...notes]);
      setShowAddNote(false);
      setNewNote({
        patient_id: id,
        note_type: 'Progress Note',
        content: '',
        created_by: 'Dr. Smith'
      });
      toast.success('Note added successfully');
    } catch (error) {
      toast.error(error.message);
      console.error('Error adding note:', error);
    }
  };
  
  const handleAddVisit = async (e) => {
    e.preventDefault();
    try {
      const result = await createVisit(newVisit);
      if (!result.success) {
        throw new Error(result.error || 'Failed to schedule visit');
      }
      
      setVisits([result.data, ...visits]);
      setShowAddVisit(false);
      setNewVisit({
        patient_id: id,
        visit_date: new Date().toISOString(),
        visit_type: 'Check-up',
        chief_complaint: '',
        provider_id: '',
        department: '',
        status: 'Scheduled'
      });
      toast.success('Visit scheduled successfully');
    } catch (error) {
      toast.error(error.message);
      console.error('Error scheduling visit:', error);
    }
  };
  
  const handleEditVisit = (visit) => {
    setSelectedVisit(visit);
    setNewVisit({
      ...visit,
      visit_date: visit.visit_date
    });
    setShowEditVisit(true);
  };
  
  const handleUpdateVisit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateVisit(selectedVisit.id, newVisit);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update visit');
      }
      
      setVisits(visits.map(v => v.id === result.data.id ? result.data : v));
      setShowEditVisit(false);
      toast.success('Visit updated successfully');
    } catch (error) {
      toast.error(error.message);
      console.error('Error updating visit:', error);
    }
  };
  
  const handleAddVitals = async (e) => {
    e.preventDefault();
    try {
      const result = await recordVitals(newVitals);
      if (!result.success) {
        throw new Error(result.error || 'Failed to record vitals');
      }
      
      setVitals([result.data, ...vitals]);
      setShowAddVitals(false);
      setNewVitals({
        patient_id: id,
        temperature: '',
        heart_rate: '',
        blood_pressure: '',
        respiratory_rate: '',
        oxygen_saturation: '',
        height: '',
        weight: '',
        recorded_by: 'Dr. Smith'
      });
      toast.success('Vitals recorded successfully');
    } catch (error) {
      toast.error(error.message);
      console.error('Error recording vitals:', error);
    }
  };
  
  const handleAddPrescription = async (e) => {
    e.preventDefault();
    try {
      const result = await createPrescription(newPrescription);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create prescription');
      }
      
      setPrescriptions([result.data, ...prescriptions]);
      setShowPrescriptionModal(false);
      setNewPrescription({
        patient_id: id,
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        start_date: new Date().toISOString().split('T')[0],
        instructions: '',
        refills: 0,
        prescribed_by: 'Dr. Smith'
      });
      toast.success('Prescription created successfully');
    } catch (error) {
      toast.error(error.message);
      console.error('Error creating prescription:', error);
    }
  };
  
  const handleRefillPrescription = async (prescriptionId) => {
    try {
      const result = await refillPrescription(prescriptionId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to refill prescription');
      }
      
      setPrescriptions(prescriptions.map(p => p.id === result.data.id ? result.data : p));
      toast.success('Prescription refilled successfully');
    } catch (error) {
      toast.error(error.message);
      console.error('Error refilling prescription:', error);
    }
  };
  
  const handleDeletePatient = async () => {
    try {
      const result = await deletePatient(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete patient');
      }
      
      toast.success('Patient deleted successfully');
      navigate('/patients');
    } catch (error) {
      toast.error(error.message);
      console.error('Error deleting patient:', error);
    }
  };
  
  const handleFieldChange = (field, value) => {
    setEditedPatient({
      ...editedPatient,
      [field]: value
    });
  };
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const formatDateTime = (dateTimeString) => {
    try {
      if (!dateTimeString) return 'N/A';
      return format(parseISO(dateTimeString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };
  
  // Visit types and doctor list for dropdowns
  const visitTypes = [
    'Check-up',
    'Follow-up',
    'Sick Visit',
    'Physical Exam',
    'Consultation',
    'Procedure',
    'Vaccination',
    'Urgent Care'
  ];
  
  const doctors = [
    'Dr. Smith',
    'Dr. Johnson',
    'Dr. Brown',
    'Dr. Wilson',
    'Dr. Davis'
  ];
  
  const departments = [
    'Primary Care',
    'Pediatrics',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Radiology'
  ];
  
  const noteTypes = [
    'Progress Note',
    'Assessment',
    'Procedure Note',
    'Consultation',
    'Discharge Summary',
    'Admission Note',
    'Surgical Note',
    'Telephone Encounter'
  ];
  
  const medications = [
    'Lisinopril 10mg',
    'Metformin 500mg',
    'Atorvastatin 20mg',
    'Amoxicillin 500mg',
    'Amlodipine 5mg',
    'Levothyroxine 50mcg',
    'Ibuprofen 400mg',
    'Acetaminophen 500mg'
  ];
  
  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 12 hours',
    'Every 8 hours',
    'Every 6 hours',
    'Every 4 hours',
    'As needed',
    'At bedtime'
  ];
  
  const durations = [
    '7 days',
    '10 days',
    '14 days',
    '30 days',
    '60 days',
    '90 days',
    '6 months',
    '1 year',
    'Ongoing'
  ];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Not Found</h2>
        <p className="text-gray-600 mb-6">The patient you're looking for does not exist or has been removed.</p>
        <Link
          to="/patients"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Return to Patients
        </Link>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/patients" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <SafeIcon icon={FiIcons.FiArrowLeft} className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-gray-600">
              {patient.gender} • {patient.date_of_birth ? `${calculateAge(patient.date_of_birth)} years` : 'Age unknown'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePatient}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAddNote(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiFileText} className="w-4 h-4" />
                <span>Add Note</span>
              </button>
              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiFileText} className="w-4 h-4" />
                <span>Prescribe</span>
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiEdit} className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiTrash2} className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Patient Info Card */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editedPatient.first_name || ''}
                    onChange={(e) => handleFieldChange('first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editedPatient.last_name || ''}
                    onChange={(e) => handleFieldChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editedPatient.date_of_birth || ''}
                    onChange={(e) => handleFieldChange('date_of_birth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={editedPatient.gender || ''}
                    onChange={(e) => handleFieldChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Full Name:</span>
                  <span className="font-medium">{`${patient.first_name || ''} ${patient.last_name || ''}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date of Birth:</span>
                  <span className="font-medium">{formatDate(patient.date_of_birth) || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gender:</span>
                  <span className="font-medium">{patient.gender || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Blood Type:</span>
                  <span className="font-medium">{patient.blood_type || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editedPatient.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editedPatient.address || ''}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <SafeIcon icon={FiIcons.FiPhone} className="w-4 h-4 text-gray-400" />
                  <span>{patient.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <SafeIcon icon={FiIcons.FiMail} className="w-4 h-4 text-gray-400" />
                  <span>{patient.email || 'No email provided'}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <SafeIcon icon={FiIcons.FiMapPin} className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="flex-1">{patient.address || 'No address provided'}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
            
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(editedPatient.allergies) ? editedPatient.allergies.join(', ') : editedPatient.allergies || ''}
                    onChange={(e) => handleFieldChange('allergies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    value={editedPatient.insurance_policy_number || ''}
                    onChange={(e) => handleFieldChange('insurance_policy_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Insurance:</span>
                  <span className="font-medium">{patient.insurance_provider || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Policy Number:</span>
                  <span className="font-medium">{patient.insurance_policy_number || 'Not provided'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Allergies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.isArray(patient.allergies) && patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600">No known allergies</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
            
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium">{patient.emergency_contact_name || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{patient.emergency_contact_phone || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Family Information (if applicable) */}
          {patient.family_notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
              
              {editMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family Notes
                  </label>
                  <textarea
                    value={editedPatient.family_notes || ''}
                    onChange={(e) => handleFieldChange('family_notes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  ></textarea>
                </div>
              ) : (
                <p className="text-sm text-gray-700">{patient.family_notes}</p>
              )}
            </div>
          )}
        </div>
      </Card>
      
      {/* Tabs */}
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
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prescriptions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiFileText} className="w-4 h-4" />
            <span>Prescriptions</span>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Notes */}
            <Card title="Recent Notes">
              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.slice(0, 3).map((note) => (
                    <div key={note.id} className="border-l-4 border-primary-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{note.note_type}</h4>
                        <span className="text-sm text-gray-500">{formatDateTime(note.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{note.created_by}</p>
                      <p className="text-sm text-gray-800 mt-2">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No notes available</p>
                    <button
                      onClick={() => setShowAddNote(true)}
                      className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Add First Note
                    </button>
                  </div>
                )}
                
                {notes.length > 3 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setActiveTab('notes')}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All Notes
                    </button>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Recent Visits */}
            <Card title="Recent Visits">
              <div className="space-y-4">
                {visits.length > 0 ? (
                  visits.slice(0, 3).map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{visit.visit_type}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(visit.visit_date)}
                        </p>
                        {visit.chief_complaint && (
                          <p className="text-sm text-gray-700 mt-1">{visit.chief_complaint}</p>
                        )}
                      </div>
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
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No visits scheduled</p>
                    <button
                      onClick={() => setShowAddVisit(true)}
                      className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Schedule Visit
                    </button>
                  </div>
                )}
                
                {visits.length > 3 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setActiveTab('visits')}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All Visits
                    </button>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Recent Vitals */}
            <Card title="Recent Vitals">
              <div className="space-y-4">
                {vitals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Date</th>
                          <th className="text-left py-2 px-2">BP</th>
                          <th className="text-left py-2 px-2">HR</th>
                          <th className="text-left py-2 px-2">Temp</th>
                          <th className="text-left py-2 px-2">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vitals.slice(0, 3).map((vital, index) => (
                          <tr key={vital.id} className="border-b">
                            <td className="py-2 px-2 text-sm">
                              {formatDate(vital.recorded_at)}
                            </td>
                            <td className="py-2 px-2 text-sm">
                              {vital.blood_pressure || '-'}
                            </td>
                            <td className="py-2 px-2 text-sm">
                              {vital.heart_rate ? `${vital.heart_rate} bpm` : '-'}
                            </td>
                            <td className="py-2 px-2 text-sm">
                              {vital.temperature ? `${vital.temperature}°F` : '-'}
                            </td>
                            <td className="py-2 px-2 text-sm">
                              {vital.weight ? `${vital.weight} lbs` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No vitals recorded</p>
                    <button
                      onClick={() => setShowAddVitals(true)}
                      className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Record Vitals
                    </button>
                  </div>
                )}
                
                {vitals.length > 3 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setActiveTab('vitals')}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All Vitals
                    </button>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Active Prescriptions */}
            <Card title="Active Prescriptions">
              <div className="space-y-4">
                {prescriptions.length > 0 ? (
                  prescriptions
                    .filter((p) => p.status === 'Active')
                    .slice(0, 3)
                    .map((prescription) => (
                      <div
                        key={prescription.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {prescription.medication} {prescription.dosage}
                          </h4>
                          <p className="text-sm text-gray-600">{prescription.frequency}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(prescription.start_date)} to{' '}
                            {prescription.end_date ? formatDate(prescription.end_date) : 'ongoing'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-1">
                            Active
                          </span>
                          <p className="text-xs text-gray-500">
                            Refills: {prescription.refills_remaining}/{prescription.refills}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No active prescriptions</p>
                    <button
                      onClick={() => setShowPrescriptionModal(true)}
                      className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Add Prescription
                    </button>
                  </div>
                )}
                
                {prescriptions.length > 3 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setActiveTab('prescriptions')}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All Prescriptions
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <Card title="Clinical Notes">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddNote(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Add Note</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note.id} className="border-l-4 border-primary-500 pl-4 py-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{note.note_type}</h4>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(note.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">By: {note.created_by}</p>
                    <div className="mt-3 text-gray-800 whitespace-pre-line">{note.content}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={FiIcons.FiFileText} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Clinical Notes</h3>
                  <p className="text-gray-600 mb-6">
                    This patient doesn't have any clinical notes yet.
                  </p>
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                    <span>Add First Note</span>
                  </button>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Visits Tab */}
        {activeTab === 'visits' && (
          <Card title="Patient Visits">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddVisit(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Schedule Visit</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {visits.length > 0 ? (
                visits.map((visit) => (
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
                          onClick={() => handleEditVisit(visit)}
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
                    
                    <div className="flex justify-end space-x-2 pt-3 border-t">
                      {visit.status === 'Scheduled' && (
                        <>
                          <button
                            onClick={() => {
                              // Update visit status to Completed
                              const updatedVisit = { ...visit, status: 'Completed' };
                              updateVisit(visit.id, updatedVisit).then((result) => {
                                if (result.success) {
                                  setVisits(
                                    visits.map((v) => (v.id === visit.id ? result.data : v))
                                  );
                                  toast.success('Visit marked as completed');
                                } else {
                                  toast.error(result.error || 'Failed to update visit');
                                }
                              });
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => {
                              // Update visit status to Cancelled
                              const updatedVisit = { ...visit, status: 'Cancelled' };
                              updateVisit(visit.id, updatedVisit).then((result) => {
                                if (result.success) {
                                  setVisits(
                                    visits.map((v) => (v.id === visit.id ? result.data : v))
                                  );
                                  toast.success('Visit cancelled');
                                } else {
                                  toast.error(result.error || 'Failed to update visit');
                                }
                              });
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
                          setNewVitals({
                            ...newVitals,
                            visit_id: visit.id
                          });
                          setShowAddVitals(true);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Record Vitals
                      </button>
                      
                      {/* Add note button */}
                      <button
                        onClick={() => {
                          setNewNote({
                            ...newNote,
                            visit_id: visit.id
                          });
                          setShowAddNote(true);
                        }}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={FiIcons.FiCalendar} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Visits Scheduled</h3>
                  <p className="text-gray-600 mb-6">
                    This patient doesn't have any scheduled visits yet.
                  </p>
                  <button
                    onClick={() => setShowAddVisit(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                    <span>Schedule First Visit</span>
                  </button>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Vitals Tab */}
        {activeTab === 'vitals' && (
          <Card title="Vital Signs">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddVitals(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Record Vitals</span>
              </button>
            </div>
            
            {vitals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">BP</th>
                      <th className="text-left py-3 px-4">HR</th>
                      <th className="text-left py-3 px-4">Temp</th>
                      <th className="text-left py-3 px-4">RR</th>
                      <th className="text-left py-3 px-4">O2</th>
                      <th className="text-left py-3 px-4">Height</th>
                      <th className="text-left py-3 px-4">Weight</th>
                      <th className="text-left py-3 px-4">BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitals.map((vital) => (
                      <tr key={vital.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{formatDateTime(vital.recorded_at)}</td>
                        <td className="py-3 px-4">{vital.blood_pressure || '-'}</td>
                        <td className="py-3 px-4">
                          {vital.heart_rate ? `${vital.heart_rate} bpm` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {vital.temperature ? `${vital.temperature}°F` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {vital.respiratory_rate ? `${vital.respiratory_rate} /min` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {vital.oxygen_saturation ? `${vital.oxygen_saturation}%` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {vital.height ? `${vital.height} in` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {vital.weight ? `${vital.weight} lbs` : '-'}
                        </td>
                        <td className="py-3 px-4">{vital.bmi || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SafeIcon icon={FiIcons.FiActivity} className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Vitals Recorded</h3>
                <p className="text-gray-600 mb-6">
                  This patient doesn't have any vital signs recorded yet.
                </p>
                <button
                  onClick={() => setShowAddVitals(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                  <span>Record First Vitals</span>
                </button>
              </div>
            )}
          </Card>
        )}
        
        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <Card title="Prescriptions">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                <span>Add Prescription</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {prescription.medication} {prescription.dosage}
                          </h4>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              prescription.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : prescription.status === 'Completed'
                                ? 'bg-gray-100 text-gray-800'
                                : prescription.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {prescription.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{prescription.frequency}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-gray-500">
                          Refills: {prescription.refills_remaining}/{prescription.refills}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Start Date:</span>{' '}
                        {formatDate(prescription.start_date)}
                      </div>
                      {prescription.end_date && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">End Date:</span>{' '}
                          {formatDate(prescription.end_date)}
                        </div>
                      )}
                      {prescription.duration && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Duration:</span> {prescription.duration}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Prescribed By:</span>{' '}
                        {prescription.prescribed_by}
                      </div>
                    </div>
                    
                    {prescription.instructions && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Instructions:</p>
                        <p className="text-sm text-gray-800">{prescription.instructions}</p>
                      </div>
                    )}
                    
                    {prescription.status === 'Active' && (
                      <div className="flex justify-end space-x-2 pt-3 border-t">
                        {prescription.refills_remaining > 0 && (
                          <button
                            onClick={() => handleRefillPrescription(prescription.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Refill
                          </button>
                        )}
                        <button
                          onClick={() => {
                            // Update prescription status to Completed
                            const updatedPrescription = {
                              ...prescription,
                              status: 'Completed'
                            };
                            updatePrescription(prescription.id, updatedPrescription).then(
                              (result) => {
                                if (result.success) {
                                  setPrescriptions(
                                    prescriptions.map((p) =>
                                      p.id === prescription.id ? result.data : p
                                    )
                                  );
                                  toast.success('Prescription marked as completed');
                                } else {
                                  toast.error(
                                    result.error || 'Failed to update prescription'
                                  );
                                }
                              }
                            );
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => {
                            // Update prescription status to Cancelled
                            const updatedPrescription = {
                              ...prescription,
                              status: 'Cancelled'
                            };
                            updatePrescription(prescription.id, updatedPrescription).then(
                              (result) => {
                                if (result.success) {
                                  setPrescriptions(
                                    prescriptions.map((p) =>
                                      p.id === prescription.id ? result.data : p
                                    )
                                  );
                                  toast.success('Prescription cancelled');
                                } else {
                                  toast.error(
                                    result.error || 'Failed to update prescription'
                                  );
                                }
                              }
                            );
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={FiIcons.FiFileText} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions</h3>
                  <p className="text-gray-600 mb-6">
                    This patient doesn't have any prescriptions yet.
                  </p>
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                    <span>Add First Prescription</span>
                  </button>
                </div>
              )}
            </div>
          </Card>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Note
            </label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter clinical observations, assessment, and plan..."
              required
            ></textarea>
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
                Visit Date & Time *
              </label>
              <input
                type="datetime-local"
                value={new Date(newVisit.visit_date).toISOString().slice(0, 16)}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, visit_date: new Date(e.target.value).toISOString() })
                }
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
                {visitTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
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
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
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
            ></textarea>
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
      
      {/* Edit Visit Modal */}
      <Modal
        isOpen={showEditVisit}
        onClose={() => setShowEditVisit(false)}
        title="Edit Visit"
        size="lg"
      >
        <form onSubmit={handleUpdateVisit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit Date & Time *
              </label>
              <input
                type="datetime-local"
                value={new Date(newVisit.visit_date).toISOString().slice(0, 16)}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, visit_date: new Date(e.target.value).toISOString() })
                }
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
                {visitTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
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
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newVisit.status}
                onChange={(e) => setNewVisit({ ...newVisit, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
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
            ></textarea>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowEditVisit(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Update Visit
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Add Vitals Modal */}
      <Modal
        isOpen={showAddVitals}
        onClose={() => setShowAddVitals(false)}
        title="Record Vital Signs"
        size="lg"
      >
        <form onSubmit={handleAddVitals} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°F)
              </label>
              <input
                type="number"
                step="0.1"
                value={newVitals.temperature}
                onChange={(e) => setNewVitals({ ...newVitals, temperature: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="98.6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={newVitals.heart_rate}
                onChange={(e) => setNewVitals({ ...newVitals, heart_rate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Pressure
              </label>
              <input
                type="text"
                value={newVitals.blood_pressure}
                onChange={(e) => setNewVitals({ ...newVitals, blood_pressure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="120/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respiratory Rate (per minute)
              </label>
              <input
                type="number"
                value={newVitals.respiratory_rate}
                onChange={(e) =>
                  setNewVitals({ ...newVitals, respiratory_rate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="16"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oxygen Saturation (%)
              </label>
              <input
                type="number"
                max="100"
                value={newVitals.oxygen_saturation}
                onChange={(e) =>
                  setNewVitals({ ...newVitals, oxygen_saturation: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="98"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (inches)
              </label>
              <input
                type="number"
                step="0.1"
                value={newVitals.height}
                onChange={(e) => setNewVitals({ ...newVitals, height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (pounds)
              </label>
              <input
                type="number"
                step="0.1"
                value={newVitals.weight}
                onChange={(e) => setNewVitals({ ...newVitals, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="180"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recorded By
              </label>
              <select
                value={newVitals.recorded_by}
                onChange={(e) => setNewVitals({ ...newVitals, recorded_by: e.target.value })}
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
      
      {/* Add Prescription Modal */}
      <Modal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        title="New Prescription"
        size="lg"
      >
        <form onSubmit={handleAddPrescription} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication *
              </label>
              <select
                value={newPrescription.medication}
                onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Medication</option>
                {medications.map((med, index) => (
                  <option key={index} value={med}>
                    {med}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
              <input
                type="text"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 10mg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                value={newPrescription.frequency}
                onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Frequency</option>
                {frequencies.map((freq, index) => (
                  <option key={index} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={newPrescription.duration}
                onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Duration</option>
                {durations.map((duration, index) => (
                  <option key={index} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={newPrescription.start_date}
                onChange={(e) =>
                  setNewPrescription({ ...newPrescription, start_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refills</label>
              <input
                type="number"
                min="0"
                max="12"
                value={newPrescription.refills}
                onChange={(e) =>
                  setNewPrescription({ ...newPrescription, refills: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              value={newPrescription.instructions}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, instructions: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Special instructions for the patient..."
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowPrescriptionModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Prescription
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Delete Patient"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="mr-3">
                <SafeIcon
                  icon={FiIcons.FiAlertTriangle}
                  className="w-5 h-5 text-red-600"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Warning: Permanent Action</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    You are about to delete {patient.first_name} {patient.last_name}'s record.
                    This will permanently remove all patient data including medical history,
                    visits, prescriptions, and notes.
                  </p>
                  <p className="mt-2">This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To confirm, type "DELETE" in the field below:
            </label>
            <input
              type="text"
              id="confirmDelete"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type DELETE to confirm"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowDeleteConfirmation(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const confirmInput = document.getElementById('confirmDelete');
                if (confirmInput && confirmInput.value === 'DELETE') {
                  handleDeletePatient();
                } else {
                  toast.error('Please type DELETE to confirm');
                }
              }}
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

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default PatientDetails;