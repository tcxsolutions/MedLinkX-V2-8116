import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import * as FiIcons from 'react-icons/fi';
import { supabase } from '../lib/supabase';

const Patients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newPatient, setNewPatient] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    blood_type: '',
    allergies: '',
    insurance_provider: '',
    insurance_policy_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('patients_medlink_x7a9b2c3')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setPatients(data);
      } else {
        // If no data, use mock data
        setPatients(getMockPatients());
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients. Using mock data.');
      setPatients(getMockPatients());
    } finally {
      setLoading(false);
    }
  };

  // Mock data as a fallback
  const getMockPatients = () => {
    return [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        age: 45,
        gender: 'Male',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@email.com',
        address: '123 Main St, City, State 12345',
        blood_type: 'A+',
        allergies: ['Penicillin', 'Shellfish'],
        insurance_provider: 'Blue Cross',
        status: 'Active',
        last_visit: '2024-01-15',
        next_appointment: '2024-01-25',
        condition: 'Hypertension',
        doctor: 'Dr. Smith'
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        age: 32,
        gender: 'Female',
        phone: '+1 (555) 987-6543',
        email: 'jane.smith@email.com',
        address: '456 Oak Ave, City, State 12345',
        blood_type: 'B-',
        allergies: ['Latex'],
        insurance_provider: 'Aetna',
        status: 'Discharged',
        last_visit: '2024-01-10',
        next_appointment: null,
        condition: 'Diabetes',
        doctor: 'Dr. Johnson'
      },
      {
        id: 3,
        first_name: 'Bob',
        last_name: 'Johnson',
        age: 67,
        gender: 'Male',
        phone: '+1 (555) 456-7890',
        email: 'bob.johnson@email.com',
        address: '789 Pine Rd, City, State 12345',
        blood_type: 'O+',
        allergies: ['Aspirin'],
        insurance_provider: 'Medicare',
        status: 'Critical',
        last_visit: '2024-01-18',
        next_appointment: '2024-01-20',
        condition: 'Chest Pain',
        doctor: 'Dr. Brown'
      }
    ];
  };

  const filteredPatients = patients.filter(patient => {
    // Build full name for search
    const fullName = `${patient.first_name || ''} ${patient.middle_name || ''} ${patient.last_name || ''}`.toLowerCase();
    
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchTerm));
      
    const matchesFilter = filterStatus === 'all' || 
      (patient.status && patient.status.toLowerCase() === filterStatus.toLowerCase());
      
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'critical': return 'bg-danger-100 text-danger-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    
    try {
      // Convert allergies from comma-separated string to array
      const allergiesArray = newPatient.allergies 
        ? newPatient.allergies.split(',').map(a => a.trim()) 
        : [];
        
      // Prepare patient data
      const patientData = {
        ...newPatient,
        allergies: allergiesArray
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('patients_medlink_x7a9b2c3')
        .insert([patientData])
        .select();
        
      if (error) throw error;
      
      // Add new patient to state
      if (data && data[0]) {
        setPatients([data[0], ...patients]);
        toast.success('Patient added successfully!');
      }
      
      // Close modal and reset form
      setShowAddModal(false);
      setNewPatient({
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        blood_type: '',
        allergies: '',
        insurance_provider: '',
        insurance_policy_number: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient');
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    
    // Convert allergies array to comma-separated string
    const allergiesString = Array.isArray(patient.allergies) 
      ? patient.allergies.join(', ')
      : patient.allergies || '';
      
    setNewPatient({
      first_name: patient.first_name || '',
      middle_name: patient.middle_name || '',
      last_name: patient.last_name || '',
      date_of_birth: patient.date_of_birth || '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      blood_type: patient.blood_type || '',
      allergies: allergiesString,
      insurance_provider: patient.insurance_provider || '',
      insurance_policy_number: patient.insurance_policy_number || '',
      emergency_contact_name: patient.emergency_contact_name || '',
      emergency_contact_phone: patient.emergency_contact_phone || '',
    });
    
    setShowAddModal(true);
  };

  const handleDeletePatient = async (patient) => {
    setSelectedPatient(patient);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedPatient) return;
    
    try {
      const { error } = await supabase
        .from('patients_medlink_x7a9b2c3')
        .delete()
        .eq('id', selectedPatient.id);
        
      if (error) throw error;
      
      // Remove from state
      setPatients(patients.filter(p => p.id !== selectedPatient.id));
      toast.success('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    } finally {
      setShowConfirmDelete(false);
      setSelectedPatient(null);
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <SafeIcon
                icon={FiIcons.FiSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiIcons.FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="critical">Critical</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {filteredPatients.length} patients
            </span>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPatients.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SafeIcon icon={FiIcons.FiUsers} className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "No patients match your search criteria."
                : "Get started by adding your first patient."}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </Card>
      )}

      {/* Patients Grid */}
      {!loading && filteredPatients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {patient.first_name && patient.first_name[0]}
                        {patient.last_name && patient.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {patient.first_name} {patient.middle_name && patient.middle_name + ' '}{patient.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {patient.age || calculateAge(patient.date_of_birth)} years • {patient.gender}
                      </p>
                    </div>
                  </div>
                  {patient.status && (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        patient.status
                      )}`}
                    >
                      {patient.status}
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  {patient.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiIcons.FiPhone} className="w-4 h-4" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiIcons.FiMail} className="w-4 h-4" />
                      <span>{patient.email}</span>
                    </div>
                  )}
                  {patient.doctor && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiIcons.FiUser} className="w-4 h-4" />
                      <span>{patient.doctor}</span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  {patient.condition && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Condition:</span>
                      <span className="font-medium text-gray-900">{patient.condition}</span>
                    </div>
                  )}
                  {patient.last_visit && (
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Last Visit:</span>
                      <span className="text-gray-900">{patient.last_visit}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleViewPatient(patient.id)}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <SafeIcon icon={FiIcons.FiEye} className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditPatient(patient)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePatient(patient)}
                      className="p-1 text-gray-400 hover:text-danger-600"
                    >
                      <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Patient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedPatient(null);
          setNewPatient({
            first_name: '',
            middle_name: '',
            last_name: '',
            date_of_birth: '',
            gender: '',
            phone: '',
            email: '',
            address: '',
            blood_type: '',
            allergies: '',
            insurance_provider: '',
            insurance_policy_number: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
          });
        }}
        title={selectedPatient ? "Edit Patient" : "Add New Patient"}
        size="lg"
      >
        <form onSubmit={handleAddPatient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={newPatient.first_name}
                onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
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
                value={newPatient.middle_name}
                onChange={(e) => setNewPatient({ ...newPatient, middle_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={newPatient.last_name}
                onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
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
                value={newPatient.date_of_birth}
                onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
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
                value={newPatient.blood_type}
                onChange={(e) => setNewPatient({ ...newPatient, blood_type: e.target.value })}
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
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={newPatient.address}
              onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
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
              value={newPatient.allergies}
              onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
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
                value={newPatient.insurance_provider}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, insurance_provider: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Policy Number
              </label>
              <input
                type="text"
                value={newPatient.insurance_policy_number}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, insurance_policy_number: e.target.value })
                }
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
                value={newPatient.emergency_contact_name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, emergency_contact_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={newPatient.emergency_contact_phone}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, emergency_contact_phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setSelectedPatient(null);
                setNewPatient({
                  first_name: '',
                  middle_name: '',
                  last_name: '',
                  date_of_birth: '',
                  gender: '',
                  phone: '',
                  email: '',
                  address: '',
                  blood_type: '',
                  allergies: '',
                  insurance_provider: '',
                  insurance_policy_number: '',
                  emergency_contact_name: '',
                  emergency_contact_phone: '',
                });
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {selectedPatient ? "Update Patient" : "Add Patient"}
            </button>
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
          <div className="bg-danger-100 text-danger-800 p-4 rounded-lg">
            <div className="flex items-start">
              <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-5 h-5 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium">Delete Patient Record?</h4>
                <p className="text-sm mt-1">
                  This action cannot be undone. All data associated with this patient will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
          
          {selectedPatient && (
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <p className="font-medium">
                {selectedPatient.first_name} {selectedPatient.last_name}
              </p>
              <p className="text-sm text-gray-500">
                {selectedPatient.email || selectedPatient.phone || "No contact information"}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
            >
              Delete Patient
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Patients;