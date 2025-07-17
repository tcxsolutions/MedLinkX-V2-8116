import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const ClinicalNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNote, setNewNote] = useState({
    patientId: '',
    patientName: '',
    noteType: 'Progress Note',
    content: '',
    visitId: ''
  });

  // Sample data for clinical notes
  const clinicalNotes = [
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 'P001',
      noteType: 'Progress Note',
      createdBy: 'Dr. Smith',
      createdAt: '2024-01-20 14:30',
      content: 'Patient reports improvement in symptoms. Blood pressure is now 130/85, down from 140/90 last visit. Continue current medication regimen and follow up in 3 months.',
      visitId: 'V001'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 'P002',
      noteType: 'Assessment',
      createdBy: 'Dr. Johnson',
      createdAt: '2024-01-19 10:15',
      content: 'Patient presents with symptoms of seasonal allergies. Prescribed Loratadine 10mg once daily. Advised to increase fluid intake and avoid outdoor activities during high pollen count days.',
      visitId: 'V002'
    },
    {
      id: 3,
      patientName: 'John Doe',
      patientId: 'P001',
      noteType: 'Procedure Note',
      createdBy: 'Dr. Wilson',
      createdAt: '2024-01-15 09:45',
      content: 'Performed ECG. Results show normal sinus rhythm. No evidence of ischemia or arrhythmia. ECG results discussed with patient.',
      visitId: 'V003'
    },
    {
      id: 4,
      patientName: 'Bob Wilson',
      patientId: 'P003',
      noteType: 'Consultation',
      createdBy: 'Dr. Brown',
      createdAt: '2024-01-18 16:20',
      content: 'Patient referred for cardiology consultation due to chest pain. Recommended stress test and 24-hour Holter monitoring. Will follow up after test results.',
      visitId: 'V004'
    }
  ];

  // Sample patients for filter dropdown
  const patients = [
    { id: 'P001', name: 'John Doe' },
    { id: 'P002', name: 'Jane Smith' },
    { id: 'P003', name: 'Bob Wilson' }
  ];

  // Note types for dropdown
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

  // Filter notes based on search term and patient filter
  const filteredNotes = clinicalNotes.filter(note => {
    const matchesSearch = 
      note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.noteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterPatient === 'all' || note.patientId === filterPatient;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    console.log('Adding note:', newNote);
    setShowAddModal(false);
    setNewNote({
      patientId: '',
      patientName: '',
      noteType: 'Progress Note',
      content: '',
      visitId: ''
    });
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setShowViewModal(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
          <h1 className="text-2xl font-bold text-gray-900">Clinical Notes</h1>
          <p className="text-gray-600">Document and manage patient clinical notes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5" />
          <span>Add Note</span>
        </button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiIcons.FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={filterPatient}
                onChange={(e) => setFilterPatient(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Patients</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.name}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {filteredNotes.length} notes
            </span>
          </div>
        </div>
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SafeIcon icon={FiIcons.FiFileText} className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Clinical Notes Found</h3>
              <p className="text-gray-600 mb-6">No notes match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterPatient('all');
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiIcons.FiRefreshCw} className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} hover onClick={() => handleViewNote(note)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{note.noteType}</h3>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Visit: {note.visitId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Patient: {note.patientName} (ID: {note.patientId})
                  </p>
                </div>
                <div className="text-sm text-right">
                  <p className="text-gray-500">{formatDate(note.createdAt)}</p>
                  <p className="text-gray-700">{note.createdBy}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-800 line-clamp-2">
                {note.content}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="text-primary-600 text-sm flex items-center space-x-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewNote(note);
                  }}
                >
                  <span>Read more</span>
                  <SafeIcon icon={FiIcons.FiArrowRight} className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Note Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Clinical Note"
        size="lg"
      >
        <form onSubmit={handleAddNote} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID *
              </label>
              <select
                value={newNote.patientId}
                onChange={(e) => {
                  const patient = patients.find(p => p.id === e.target.value);
                  setNewNote({
                    ...newNote,
                    patientId: e.target.value,
                    patientName: patient ? patient.name : ''
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Type *
              </label>
              <select
                value={newNote.noteType}
                onChange={(e) => setNewNote({...newNote, noteType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {noteTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit ID
              </label>
              <input
                type="text"
                value={newNote.visitId}
                onChange={(e) => setNewNote({...newNote, visitId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Optional - Link to visit"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Content *
            </label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter detailed clinical observations, assessments, and plans..."
              required
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
              Save Note
            </button>
          </div>
        </form>
      </Modal>

      {/* View Note Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedNote?.noteType || 'Clinical Note'}
        size="lg"
      >
        {selectedNote && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">
                  Patient: <span className="font-medium">{selectedNote.patientName}</span> (ID: {selectedNote.patientId})
                </p>
                <p className="text-sm text-gray-600">
                  Visit ID: <span className="font-medium">{selectedNote.visitId}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Created by: <span className="font-medium">{selectedNote.createdBy}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date: <span className="font-medium">{formatDate(selectedNote.createdAt)}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <p className="whitespace-pre-line text-gray-800">{selectedNote.content}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log('Printing note:', selectedNote.id);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiIcons.FiPrinter} className="w-4 h-4" />
                  <span>Print</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default ClinicalNotes;