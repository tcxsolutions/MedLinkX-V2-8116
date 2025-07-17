import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiArrowLeft, FiEdit, FiPlus, FiCalendar, FiFileText, 
  FiPill, FiActivity, FiPhone, FiMail, FiMapPin, FiUser
} = FiIcons;

const PatientDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  // Mock patient data
  const patient = {
    id: 1,
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    address: '123 Main St, City, State 12345',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Shellfish'],
    insurance: 'Blue Cross',
    status: 'Active',
    admissionDate: '2024-01-15',
    doctor: 'Dr. Smith',
    department: 'Cardiology',
    condition: 'Hypertension',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543'
  };

  const medicalHistory = [
    { date: '2024-01-18', type: 'Consultation', doctor: 'Dr. Smith', notes: 'Blood pressure check - 140/90' },
    { date: '2024-01-15', type: 'Lab Test', doctor: 'Dr. Johnson', notes: 'Lipid panel - elevated cholesterol' },
    { date: '2024-01-10', type: 'Prescription', doctor: 'Dr. Smith', notes: 'Prescribed Lisinopril 10mg daily' }
  ];

  const prescriptions = [
    { id: 1, medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2024-01-10', status: 'Active' },
    { id: 2, medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2024-01-05', status: 'Active' },
    { id: 3, medication: 'Aspirin', dosage: '81mg', frequency: 'Once daily', startDate: '2024-01-01', status: 'Completed' }
  ];

  const vitals = [
    { date: '2024-01-18', bp: '140/90', hr: '72', temp: '98.6°F', weight: '180 lbs' },
    { date: '2024-01-15', bp: '145/95', hr: '75', temp: '98.4°F', weight: '182 lbs' },
    { date: '2024-01-10', bp: '138/88', hr: '70', temp: '98.2°F', weight: '181 lbs' }
  ];

  const appointments = [
    { id: 1, date: '2024-01-25', time: '10:00 AM', type: 'Follow-up', doctor: 'Dr. Smith', status: 'Scheduled' },
    { id: 2, date: '2024-02-01', time: '2:00 PM', type: 'Lab Work', doctor: 'Dr. Johnson', status: 'Scheduled' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'history', label: 'Medical History', icon: FiFileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: FiPill },
    { id: 'vitals', label: 'Vitals', icon: FiActivity },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar }
  ];

  const handleAddNote = (e) => {
    e.preventDefault();
    // Add note logic here
    console.log('Adding note:', newNote);
    setShowAddNote(false);
    setNewNote('');
  };

  const handleAddPrescription = (e) => {
    e.preventDefault();
    // Add prescription logic here
    console.log('Adding prescription:', newPrescription);
    setShowPrescriptionModal(false);
    setNewPrescription({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-primary-100 text-primary-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/patients"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">{patient.condition} • {patient.department}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddNote(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Note</span>
          </button>
          <button
            onClick={() => setShowPrescriptionModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
          >
            <SafeIcon icon={FiPill} className="w-4 h-4" />
            <span>Prescribe</span>
          </button>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{patient.name}</h3>
              <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400" />
              <span>{patient.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400" />
              <span>{patient.address}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Blood Type:</span>
              <span className="font-medium">{patient.bloodType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Insurance:</span>
              <span className="font-medium">{patient.insurance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Admission:</span>
              <span className="font-medium">{patient.admissionDate}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Doctor:</span>
              <span className="font-medium">{patient.doctor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Department:</span>
              <span className="font-medium">{patient.department}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Allergies:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.allergies.map((allergy, index) => (
                  <span key={index} className="px-2 py-1 bg-danger-100 text-danger-800 text-xs rounded-full">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Emergency Contact">
              <p className="text-gray-900">{patient.emergencyContact}</p>
            </Card>
            <Card title="Recent Activity">
              <div className="space-y-3">
                {medicalHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.type}</p>
                      <p className="text-xs text-gray-500">{item.date} • {item.doctor}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <Card title="Medical History">
            <div className="space-y-4">
              {medicalHistory.map((item, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{item.type}</h4>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.doctor}</p>
                  <p className="text-sm text-gray-800 mt-2">{item.notes}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'prescriptions' && (
          <Card title="Current Prescriptions">
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{prescription.medication}</h4>
                    <p className="text-sm text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                    <p className="text-xs text-gray-500">Started: {prescription.startDate}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'vitals' && (
          <Card title="Vital Signs">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Blood Pressure</th>
                    <th className="text-left py-2">Heart Rate</th>
                    <th className="text-left py-2">Temperature</th>
                    <th className="text-left py-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.map((vital, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{vital.date}</td>
                      <td className="py-2">{vital.bp}</td>
                      <td className="py-2">{vital.hr}</td>
                      <td className="py-2">{vital.temp}</td>
                      <td className="py-2">{vital.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'appointments' && (
          <Card title="Upcoming Appointments">
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.type}</h4>
                    <p className="text-sm text-gray-600">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Add Note Modal */}
      <Modal
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        title="Add Clinical Note"
      >
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Note
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter clinical observations, assessment, and plan..."
              required
            />
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

      {/* Add Prescription Modal */}
      <Modal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        title="New Prescription"
      >
        <form onSubmit={handleAddPrescription} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication *
              </label>
              <input
                type="text"
                value={newPrescription.medication}
                onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
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
                onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="As needed">As needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={newPrescription.duration}
                onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 30 days"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={newPrescription.instructions}
              onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Special instructions for the patient..."
            />
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
              Prescribe
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default PatientDetails;