import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useOrganization } from '../../contexts/OrganizationContext';
import { importData, exportData, getImportHistory, getExportHistory, bulkDeleteRecords, generateSampleFile } from '../../utils/importExportService';

const DataImportExport = () => {
  const { selectedOrganization } = useOrganization();
  const [activeTab, setActiveTab] = useState('import');
  const [importType, setImportType] = useState('patients');
  const [exportType, setExportType] = useState('patients');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importFile, setImportFile] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  const [exportHistory, setExportHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);

  const dataTypes = [
    { id: 'patients', label: 'Patients', icon: FiIcons.FiUsers },
    { id: 'appointments', label: 'Appointments', icon: FiIcons.FiCalendar },
    { id: 'inventory', label: 'Inventory', icon: FiIcons.FiPackage },
    { id: 'billing', label: 'Billing', icon: FiIcons.FiDollarSign },
  ];

  const exportFormats = [
    { id: 'csv', label: 'CSV', icon: FiIcons.FiFileText },
    { id: 'xlsx', label: 'Excel', icon: FiIcons.FiFileText },
    { id: 'json', label: 'JSON', icon: FiIcons.FiFileText },
  ];

  // Fetch import and export history
  useEffect(() => {
    if (selectedOrganization) {
      fetchImportHistory();
      fetchExportHistory();
    }
  }, [selectedOrganization]);

  const fetchImportHistory = async () => {
    if (!selectedOrganization) return;
    const result = await getImportHistory(selectedOrganization.id);
    if (result.success) {
      setImportHistory(result.imports);
    }
  };

  const fetchExportHistory = async () => {
    if (!selectedOrganization) return;
    const result = await getExportHistory(selectedOrganization.id);
    if (result.success) {
      setExportHistory(result.exports);
    }
  };

  const handleFileChange = (e) => {
    setImportFile(e.target.files[0]);
    setError('');
  };

  const handleImport = async () => {
    if (!importFile) {
      setError('Please select a file to import');
      return;
    }

    try {
      setIsImporting(true);
      setError('');
      setSuccess('');

      const result = await importData(
        importFile,
        importType,
        selectedOrganization.id,
        (progress) => setImportProgress(Math.round(progress * 100))
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(`Import completed successfully. ${result.summary.created} records created, ${result.summary.updated} records updated.`);
      setImportFile(null);
      if (document.getElementById('import-file')) {
        document.getElementById('import-file').value = '';
      }

      // Refresh import history
      await fetchImportHistory();
    } catch (err) {
      setError('Error importing data: ' + err.message);
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError('');
      setSuccess('');

      const result = await exportData(
        exportType,
        exportFormat,
        selectedOrganization.id
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(`Export completed successfully. ${result.recordCount} records exported.`);

      // Refresh export history
      await fetchExportHistory();
    } catch (err) {
      setError('Error exporting data: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRecords.length) {
      setError('Please select records to delete');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRecords.length} records? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      setError('');
      setSuccess('');

      const result = await bulkDeleteRecords(
        importType,
        selectedRecords,
        selectedOrganization.id
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(`${result.deletedCount} records deleted successfully.`);
      setSelectedRecords([]);
    } catch (err) {
      setError('Error deleting records: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateSample = async (dataType, format) => {
    try {
      setIsGeneratingSample(true);
      setError('');
      setSuccess('');

      const result = await generateSampleFile(dataType, format);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Create and trigger download
      const blob = new Blob([result.content], { type: result.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess(`Sample ${format.toUpperCase()} file downloaded successfully.`);
    } catch (err) {
      setError('Error generating sample file: ' + err.message);
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (!selectedOrganization) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-600">Import, export, and manage your organization's data</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'import'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiDownload} className="w-4 h-4" />
            <span>Import Data</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'export'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiUpload} className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'samples'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiDownload} className="w-4 h-4" />
            <span>Sample Files</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiClock} className="w-4 h-4" />
            <span>History</span>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bulk'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
            <span>Bulk Operations</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'import' && (
        <Card>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Import Data</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dataTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setImportType(type.id)}
                    className={`flex items-center justify-center space-x-2 p-3 border rounded-lg ${
                      importType === type.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={type.icon} className="w-5 h-5" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex-1">
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                    <SafeIcon icon={FiIcons.FiUpload} className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {importFile ? importFile.name : 'Click to select a file or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: CSV, Excel, JSON (max 10MB)
                    </p>
                    <input
                      id="import-file"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".csv,.xlsx,.xls,.json"
                      onChange={handleFileChange}
                    />
                  </div>
                </label>
                <button
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>

            {isImporting && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Importing...</span>
                  <span className="text-sm text-gray-600">{importProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${importProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Import Guidelines</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-2">
                <li>Ensure your data is properly formatted according to the system requirements</li>
                <li>CSV files should use comma as delimiter and include a header row</li>
                <li>Excel files should have data in the first sheet</li>
                <li>JSON files should contain an array of objects with consistent structure</li>
                <li>Required fields vary by data type - check documentation for details</li>
                <li>Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'export' && (
        <Card>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dataTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setExportType(type.id)}
                    className={`flex items-center justify-center space-x-2 p-3 border rounded-lg ${
                      exportType === type.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={type.icon} className="w-5 h-5" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {exportFormats.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setExportFormat(format.id)}
                    className={`flex items-center justify-center space-x-2 p-3 border rounded-lg ${
                      exportFormat === format.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={format.icon} className="w-5 h-5" />
                    <span>{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SafeIcon icon={FiIcons.FiDownload} className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'samples' && (
        <Card>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sample Files</h2>
              <p className="text-sm text-gray-600 mt-1">
                Download sample files to understand the required format for each data type
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataTypes.map(dataType => (
                <div key={dataType.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <SafeIcon icon={dataType.icon} className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{dataType.label}</h3>
                      <p className="text-sm text-gray-500">Sample data files</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {exportFormats.map(format => (
                      <button
                        key={format.id}
                        onClick={() => handleGenerateSample(dataType.id, format.id)}
                        disabled={isGeneratingSample}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={format.icon} className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {dataType.label} Sample ({format.label})
                          </span>
                        </div>
                        <SafeIcon icon={FiIcons.FiDownload} className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <Card title="Import History">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">File</th>
                    <th className="text-left py-3 px-4">Size</th>
                    <th className="text-left py-3 px-4">Records</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importHistory.length > 0 ? (
                    importHistory.map(item => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{formatDate(item.created_at)}</td>
                        <td className="py-3 px-4 text-sm capitalize">{item.import_type}</td>
                        <td className="py-3 px-4 text-sm">{item.file_name}</td>
                        <td className="py-3 px-4 text-sm">{formatFileSize(item.file_size)}</td>
                        <td className="py-3 px-4 text-sm">{item.record_count || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'completed'
                              ? 'bg-success-100 text-success-800'
                              : item.status === 'processing'
                              ? 'bg-warning-100 text-warning-800'
                              : 'bg-danger-100 text-danger-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No import history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Export History">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">File</th>
                    <th className="text-left py-3 px-4">Records</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exportHistory.length > 0 ? (
                    exportHistory.map(item => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{formatDate(item.created_at)}</td>
                        <td className="py-3 px-4 text-sm capitalize">{item.export_type}</td>
                        <td className="py-3 px-4 text-sm">{item.file_name}</td>
                        <td className="py-3 px-4 text-sm">{item.record_count || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'completed'
                              ? 'bg-success-100 text-success-800'
                              : item.status === 'processing'
                              ? 'bg-warning-100 text-warning-800'
                              : 'bg-danger-100 text-danger-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.status === 'completed' && item.download_url && (
                            <button
                              className="text-primary-600 hover:text-primary-800 text-sm flex items-center space-x-1"
                              onClick={() => window.open(item.download_url, '_blank')}
                            >
                              <SafeIcon icon={FiIcons.FiDownload} className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No export history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'bulk' && (
        <Card>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Bulk Operations</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dataTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setImportType(type.id);
                      setSelectedRecords([]);
                    }}
                    className={`flex items-center justify-center space-x-2 p-3 border rounded-lg ${
                      importType === type.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={type.icon} className="w-5 h-5" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Bulk Delete</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Warning: Irreversible Action</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Bulk deletion permanently removes records from your database. This action cannot be undone.
                      Please use with caution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record IDs (comma-separated)
                </label>
                <textarea
                  value={selectedRecords.join(',')}
                  onChange={(e) => setSelectedRecords(e.target.value.split(',').map(id => id.trim()).filter(id => id))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter record IDs to delete, separated by commas"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleBulkDelete}
                  disabled={!selectedRecords.length || isDeleting}
                  className="flex items-center space-x-2 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Records'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataImportExport;