import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiPlus, FiClock, FiUser, FiCheck, FiX, FiEdit } = FiIcons;

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('day');
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientId: '',
    date: selectedDate,
    time: '',
    type: '',
    doctor: '',
    duration: '30',
    notes: ''
  });

  const appointments = [
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 'P001',
      date: '2024-01-20',
      time: '09:00',
      type: 'Consultation',
      doctor: 'Dr. Smith',
      duration: 30,
      status: 'Confirmed',
      notes: 'Follow-up for hypertension'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 'P002',
      date: '2024-01-20',
      time: '10:30',
      type: 'Check-up',
      doctor: 'Dr. Johnson',
      duration: 45,
      status: 'Pending',
      notes: 'Annual physical examination'
    },
    {
      id: 3,
      patientName: 'Bob Wilson',
      patientId: 'P003',
      date: '2024-01-20',
      time: '14:00',
      type: 'Surgery',
      doctor: 'Dr. Brown',
      duration: 120,
      status: 'Confirmed',
      notes: 'Cardiac catheterization'
    },
    {
      id: 4,
      patientName: 'Alice Davis',
      patientId: 'P004',
      date: '2024-01-20',
      time: '16:30',
      type: 'Follow-up',
      doctor: 'Dr. Wilson',
      duration: 30,
      status: 'Cancelled',
      notes: 'Post-operative check'
    }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const appointmentTypes = [
    'Consultation', 'Check-up', 'Follow-up', 'Surgery', 'Emergency', 'Vaccination'
  ];

  const doctors = [
    'Dr. Smith', 'Dr. Johnson', 'Dr. Brown', 'Dr. Wilson', 'Dr. Davis'
  ];

  const filteredAppointments = appointments.filter(apt => apt.date === selectedDate);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'cancelled': return 'bg-danger-100 text-danger-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    console.log('Adding appointment:', newAppointment);
    setShowAddModal(false);
    setNewAppointment({
      patientName: '',
      patientId: '',
      date: selectedDate,
      time: '',
      type: '',
      doctor: '',
      duration: '30',
      notes: ''
    });
  };

  const updateAppointmentStatus = (id, status) => {
    console.log(`Updating appointment ${id} to ${status}`);
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
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments and scheduling</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'day' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredAppointments.length} appointments on {new Date(selectedDate).toLocaleDateString()}
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Slots */}
        <Card title="Schedule" subtitle={`${new Date(selectedDate).toLocaleDateString()}`}>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {timeSlots.map((time) => {
              const appointment = filteredAppointments.find(apt => apt.time === time);
              return (
                <div key={time} className="flex items-center space-x-3 p-2 border-b border-gray-100">
                  <div className="w-16 text-sm text-gray-500 font-mono">
                    {time}
                  </div>
                  {appointment ? (
                    <div className="flex-1 flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.type} • {appointment.doctor}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ) : (
                    <div className="flex-1 p-3 border border-dashed border-gray-200 rounded-lg text-center">
                      <span className="text-sm text-gray-400">Available</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Appointment Details */}
        <Card title="Appointments" subtitle="Today's scheduled appointments">
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                      <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <SafeIcon icon={FiClock} className="w-4 h-4" />
                    <span>{appointment.time} ({appointment.duration} min)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>{appointment.doctor}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <strong>Type:</strong> {appointment.type}
                </div>

                {appointment.notes && (
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Notes:</strong> {appointment.notes}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'Confirmed')}
                          className="flex items-center space-x-1 px-3 py-1 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors text-sm"
                        >
                          <SafeIcon icon={FiCheck} className="w-3 h-3" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'Cancelled')}
                          className="flex items-center space-x-1 px-3 py-1 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors text-sm"
                        >
                          <SafeIcon icon={FiX} className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    {appointment.status === 'Confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <SafeIcon icon={FiCheck} className="w-3 h-3" />
                        <span>Complete</span>
                      </button>
                    )}
                  </div>
                  <button className="p-1 text-gray-400 hover:text-primary-600">
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="New Appointment"
        size="lg"
      >
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID *
              </label>
              <input
                type="text"
                value={newAppointment.patientId}
                onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <select
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={newAppointment.type}
                onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Type</option>
                {appointmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor *
              </label>
              <select
                value={newAppointment.doctor}
                onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={newAppointment.duration}
                onChange={(e) => setNewAppointment({...newAppointment, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={newAppointment.notes}
              onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional notes or instructions..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Schedule Appointment
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Appointments;