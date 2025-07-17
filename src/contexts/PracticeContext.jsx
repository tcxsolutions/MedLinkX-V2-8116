import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PracticeContext = createContext();

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};

export const PracticeProvider = ({ children }) => {
  const [practiceSettings, setPracticeSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Features enabled based on practice type
  const [features, setFeatures] = useState({
    familyManagement: false,
    departmentManagement: false,
    advancedLabIntegration: false,
    multiProviderSupport: false,
    complexCaseManagement: false
  });

  // Load practice settings from localStorage on initial load
  useEffect(() => {
    const savedPracticeSettings = localStorage.getItem('practiceSettings');
    if (savedPracticeSettings) {
      const parsedSettings = JSON.parse(savedPracticeSettings);
      setPracticeSettings(parsedSettings);
      configureFeatures(parsedSettings.practice_type);
    }
    setLoading(false);
  }, []);

  // Configure features based on practice type
  const configureFeatures = (practiceType) => {
    switch (practiceType) {
      case 'individual':
        setFeatures({
          familyManagement: false,
          departmentManagement: false,
          advancedLabIntegration: false,
          multiProviderSupport: false,
          complexCaseManagement: false
        });
        break;
      case 'family_practice':
        setFeatures({
          familyManagement: true,
          departmentManagement: false,
          advancedLabIntegration: true,
          multiProviderSupport: true,
          complexCaseManagement: false
        });
        break;
      case 'hospital':
        setFeatures({
          familyManagement: true,
          departmentManagement: true,
          advancedLabIntegration: true,
          multiProviderSupport: true,
          complexCaseManagement: true
        });
        break;
      default:
        break;
    }
  };

  // Save or update practice settings
  const savePracticeSettings = async (settings) => {
    try {
      setLoading(true);
      
      // Create a new settings object with an ID if it doesn't exist
      const result = {
        ...settings,
        id: practiceSettings?.id || 'practice-' + Date.now()
      };
      
      setPracticeSettings(result);
      configureFeatures(result.practice_type);
      localStorage.setItem('practiceSettings', JSON.stringify(result));
      toast.success('Practice settings saved successfully');
      
      return { success: true, data: result };
    } catch (err) {
      console.error('Error saving practice settings:', err);
      setError(err.message);
      toast.error('Failed to save practice settings');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    practiceSettings,
    setPracticeSettings,
    features,
    loading,
    error,
    savePracticeSettings
  };

  return (
    <PracticeContext.Provider value={value}>
      {children}
    </PracticeContext.Provider>
  );
};