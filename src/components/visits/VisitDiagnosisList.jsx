import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const VisitDiagnosisList = ({ diagnoses, onRemove, readOnly = false }) => {
  if (!diagnoses || diagnoses.length === 0) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No diagnoses added</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {diagnoses.map((diagnosis) => {
        const diagnosticCode = diagnosis.diagnostic_code || {
          code: 'Unknown',
          description: 'Code details not available'
        };
        
        return (
          <motion.div
            key={diagnosis.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={`p-3 border rounded-lg ${diagnosis.primary ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{diagnosticCode.code}</span>
                  {diagnosis.primary && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{diagnosticCode.description}</p>
                {diagnosis.notes && (
                  <p className="text-xs text-gray-500 mt-1 italic">{diagnosis.notes}</p>
                )}
              </div>
              
              {!readOnly && (
                <button
                  onClick={() => onRemove(diagnosis.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="Remove diagnosis"
                >
                  <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default VisitDiagnosisList;