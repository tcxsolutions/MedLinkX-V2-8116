import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { initializeDatabase, checkDatabaseStatus } from '../../utils/databaseSetup';

const DatabaseInitializer = ({ onComplete }) => {
  const [status, setStatus] = useState('checking'); // checking, initializing, complete, error
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkAndInitializeDatabase();
  }, []);

  const checkAndInitializeDatabase = async () => {
    try {
      setStatus('checking');
      setProgress(10);

      // Check if database is already initialized
      const dbStatus = await checkDatabaseStatus();
      setProgress(30);

      if (dbStatus.initialized && dbStatus.hasData) {
        setProgress(100);
        setStatus('complete');
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000);
        return;
      }

      // Initialize database
      setStatus('initializing');
      setProgress(50);

      const result = await initializeDatabase();
      setProgress(90);

      if (result.success) {
        setProgress(100);
        setStatus('complete');
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000);
      } else {
        setStatus('error');
        setError(result.error);
      }
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: FiIcons.FiSearch,
          title: 'Checking Database',
          description: 'Verifying database structure...',
          color: 'blue'
        };
      case 'initializing':
        return {
          icon: FiIcons.FiDatabase,
          title: 'Initializing Database',
          description: 'Setting up tables and sample data...',
          color: 'blue'
        };
      case 'complete':
        return {
          icon: FiIcons.FiCheckCircle,
          title: 'Database Ready',
          description: 'All systems are ready to go!',
          color: 'green'
        };
      case 'error':
        return {
          icon: FiIcons.FiAlertCircle,
          title: 'Initialization Failed',
          description: error || 'An error occurred during setup',
          color: 'red'
        };
      default:
        return {
          icon: FiIcons.FiLoader,
          title: 'Loading',
          description: 'Please wait...',
          color: 'gray'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 border border-gray-100"
      >
        <div className="text-center">
          {/* Icon */}
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            statusInfo.color === 'blue' ? 'bg-blue-100' :
            statusInfo.color === 'green' ? 'bg-green-100' :
            statusInfo.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <SafeIcon 
              icon={statusInfo.icon} 
              className={`w-8 h-8 ${
                statusInfo.color === 'blue' ? 'text-blue-600' :
                statusInfo.color === 'green' ? 'text-green-600' :
                statusInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'
              } ${status === 'checking' || status === 'initializing' ? 'animate-spin' : ''}`} 
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {statusInfo.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {statusInfo.description}
          </p>

          {/* Progress Bar */}
          {(status === 'checking' || status === 'initializing') && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <p className="text-sm text-red-700">
                  <strong>Error Details:</strong><br />
                  {error}
                </p>
              </div>
              <button
                onClick={checkAndInitializeDatabase}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiIcons.FiRefreshCw} className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {status === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <p className="text-sm text-green-700">
                Database initialized successfully! You can now use all features of the application.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DatabaseInitializer;