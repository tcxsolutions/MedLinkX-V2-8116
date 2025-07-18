import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { usePractice } from '../../contexts/PracticeContext';
import { createVisit } from '../../services/visitService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DiagnosticCodeSelector from '../visits/DiagnosticCodeSelector';
import VisitDiagnosisList from '../visits/VisitDiagnosisList';
import VoiceToTextInput from '../visits/VoiceToTextInput';

const PatientVisitForm = ({ patientId, patientName, onSuccess, onCancel }) => {
  const { practiceSettings, features } = usePractice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitDate, setVisitDate] = useState(new Date());
  const [providers, setProviders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
  const [notesContent, setNotesContent] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      patient_id: patientId,
      visit_type: 'Check-up',
      chief_complaint: '',
      provider_id: '',
      department: '',
      status: 'Scheduled'
    }
  });

  // Set visit date in form when it changes
  useEffect(() => {
    setValue('visit_date', visitDate.toISOString());
  }, [visitDate, setValue]);

  // Mock providers and departments
  useEffect(() => {
    // In a real app, these would come from an API call
    setProviders([
      { id: '1', name: 'Dr. John Smith', department: 'Primary Care' },
      { id: '2', name: 'Dr. Sarah Johnson', department: 'Pediatrics' },
      { id: '3', name: 'Dr. Michael Brown', department: 'Cardiology' },
    ]);

    setDepartments([
      { id: '1', name: 'Primary Care' },
      { id: '2', name: 'Pediatrics' },
      { id: '3', name: 'Cardiology' },
      { id: '4', name: 'Neurology' },
      { id: '5', name: 'Orthopedics' },
      { id: '6', name: 'Radiology' }
    ]);
  }, []);

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

  const handleAddDiagnosis = (code) => {
    // Check if already added
    if (selectedDiagnoses.some(d => d.id === code.id)) {
      return;
    }
    
    // Add the diagnosis
    const newDiagnosis = {
      id: `temp-${Date.now()}`,
      diagnostic_code_id: code.id,
      diagnostic_code: code,
      primary: selectedDiagnoses.length === 0, // First one is primary
      notes: '',
      created_at: new Date().toISOString(),
      created_by: 'Current User'
    };
    
    setSelectedDiagnoses([...selectedDiagnoses, newDiagnosis]);
  };

  const handleRemoveDiagnosis = (diagnosisId) => {
    setSelectedDiagnoses(selectedDiagnoses.filter(d => d.id !== diagnosisId));
  };

  const handleNotesChange = (e) => {
    setNotesContent(e.target.value);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Ensure visit_date is in ISO format
    const visitData = {
      ...data,
      patient_id: patientId,
      visit_date: visitDate.toISOString(),
      diagnoses: selectedDiagnoses.map(d => ({
        diagnostic_code_id: d.diagnostic_code_id,
        primary: d.primary,
        notes: d.notes
      })),
      clinical_notes: notesContent
    };

    const result = await createVisit(visitData);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess(result.data);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-1">
          <SafeIcon icon={FiIcons.FiCalendar} className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Schedule Visit</h2>
        </div>
        <p className="text-gray-600">
          Scheduling visit for <span className="font-medium">{patientName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Date & Time *
            </label>
            <DatePicker
              selected={visitDate}
              onChange={date => setVisitDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.visit_date && (
              <p className="mt-1 text-sm text-red-600">{errors.visit_date.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Type *
            </label>
            <select
              {...register('visit_type', { required: 'Visit type is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {visitTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.visit_type && (
              <p className="mt-1 text-sm text-red-600">{errors.visit_type.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider
            </label>
            <select
              {...register('provider_id')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Provider</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} ({provider.department})
                </option>
              ))}
            </select>
          </div>
          {features.departmentManagement && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                {...register('department')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chief Complaint *
          </label>
          <textarea
            {...register('chief_complaint', { required: 'Chief complaint is required' })}
            rows="4"
            placeholder="Describe the main reason for the visit"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.chief_complaint && (
            <p className="mt-1 text-sm text-red-600">{errors.chief_complaint.message}</p>
          )}
        </div>

        {/* Diagnostic Codes Section */}
        <div className="space-y-4 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900">Diagnostic Codes</h3>
          <p className="text-sm text-gray-600">
            Add diagnostic codes to associate with this visit
          </p>
          
          <DiagnosticCodeSelector 
            onSelect={handleAddDiagnosis} 
            selectedCodes={selectedDiagnoses.map(d => d.diagnostic_code)}
          />
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Diagnoses</h4>
            <VisitDiagnosisList 
              diagnoses={selectedDiagnoses}
              onRemove={handleRemoveDiagnosis}
            />
          </div>
        </div>

        {/* Clinical Notes with Voice-to-Text */}
        <div className="space-y-4 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900">Clinical Notes</h3>
          <p className="text-sm text-gray-600">
            Add clinical notes using voice-to-text or typing
          </p>
          
          <VoiceToTextInput
            value={notesContent}
            onChange={handleNotesChange}
            rows={6}
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiIcons.FiCalendar} className="w-5 h-5" />
                <span>Schedule Visit</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientVisitForm;