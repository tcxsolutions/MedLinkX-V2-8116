import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { createTables, initializeDatabase } from '../../services/databaseSetup';
import { toast } from 'react-toastify';

const DatabaseInitializer = ({ onComplete }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleInitialize = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      // Create tables
      setProgress(20);
      const { success, error: tablesError } = await createTables();
      if (!success) {
        throw new Error(tablesError || 'Failed to create tables');
      }

      // Initialize database
      setProgress(60);
      const { success: initSuccess, error: initError } = await initializeDatabase();
      if (!initSuccess) {
        throw new Error(initError || 'Failed to initialize database');
      }

      setProgress(100);
      toast.success('Database initialized successfully!');
      onComplete?.();
    } catch (error) {
      console.error('Database initialization error:', error);
      setError(error.message);
      toast.error(`Failed to initialize database: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiIcons.FiDatabase} className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Setup</h1>
            <p className="text-gray-600">
              Initialize your database with required tables and initial data
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <SafeIcon
                  icon={FiIcons.FiAlertTriangle}
                  className="w-5 h-5 text-red-600 mt-0.5 mr-3"
                />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Initialization Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isInitializing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Initializing...</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Please wait while we set up your database...
              </p>
            </div>
          ) : (
            <button
              onClick={handleInitialize}
              disabled={isInitializing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiIcons.FiDatabase} className="w-5 h-5" />
              <span>Initialize Database</span>
            </button>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This will create all necessary tables and set up initial data
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DatabaseInitializer;