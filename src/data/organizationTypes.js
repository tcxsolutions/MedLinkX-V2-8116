// Comprehensive healthcare organization types configuration
export const ORGANIZATION_TYPES = {
  clinic: {
    id: 'clinic',
    name: 'General Clinic',
    description: 'Primary care clinic providing routine medical services',
    icon: 'FiHeart',
    color: 'blue',
    category: 'Primary Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      basicReporting: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments'],
    optionalFeatures: ['billing', 'inventory', 'labIntegration'],
    complianceRequirements: ['HIPAA', 'State Licensing']
  },
  
  family_practice: {
    id: 'family_practice',
    name: 'Family Practice',
    description: 'Comprehensive care for patients of all ages and families',
    icon: 'FiUsers',
    color: 'green',
    category: 'Primary Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      familyManagement: true,
      basicReporting: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'familyManagement'],
    optionalFeatures: ['advancedLabIntegration', 'inventory', 'userManagement'],
    complianceRequirements: ['HIPAA', 'State Licensing', 'Family Consent']
  },

  hospital: {
    id: 'hospital',
    name: 'Hospital System',
    description: 'Full-service hospital with multiple departments and specialties',
    icon: 'FiActivity',
    color: 'purple',
    category: 'Acute Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      departmentManagement: true,
      advancedLabIntegration: true,
      billing: true,
      inventory: true,
      pharmacy: true,
      userManagement: true,
      advancedReporting: true
    },
    requiredFeatures: ['patientManagement', 'departmentManagement', 'userManagement', 'advancedReporting'],
    optionalFeatures: ['emergencyManagement', 'surgeryScheduling', 'bedManagement'],
    complianceRequirements: ['HIPAA', 'Joint Commission', 'CMS', 'State Licensing']
  },

  laboratory: {
    id: 'laboratory',
    name: 'Laboratory Services',
    description: 'Diagnostic laboratory providing testing services',
    icon: 'FiFileText',
    color: 'indigo',
    category: 'Diagnostic',
    defaultFeatures: {
      labManagement: true,
      testOrdering: true,
      resultReporting: true,
      qualityControl: true,
      billing: true
    },
    requiredFeatures: ['labManagement', 'testOrdering', 'resultReporting'],
    optionalFeatures: ['patientManagement', 'appointments', 'inventory'],
    complianceRequirements: ['CLIA', 'CAP', 'HIPAA', 'State Licensing']
  },

  imaging_center: {
    id: 'imaging_center',
    name: 'Imaging Center',
    description: 'Medical imaging and radiology services',
    icon: 'FiCamera',
    color: 'teal',
    category: 'Diagnostic',
    defaultFeatures: {
      imagingManagement: true,
      appointmentScheduling: true,
      radiologyReporting: true,
      billing: true
    },
    requiredFeatures: ['imagingManagement', 'radiologyReporting'],
    optionalFeatures: ['patientManagement', 'inventory', 'pacs'],
    complianceRequirements: ['ACR', 'HIPAA', 'State Licensing', 'Radiation Safety']
  },

  pharmacy: {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Prescription dispensing and pharmaceutical services',
    icon: 'FiPackage',
    color: 'emerald',
    category: 'Pharmacy',
    defaultFeatures: {
      pharmacyManagement: true,
      prescriptionProcessing: true,
      inventoryManagement: true,
      drugInteractions: true,
      billing: true
    },
    requiredFeatures: ['pharmacyManagement', 'prescriptionProcessing', 'inventoryManagement'],
    optionalFeatures: ['patientManagement', 'compounding', 'vaccinations'],
    complianceRequirements: ['DEA', 'State Board of Pharmacy', 'HIPAA', 'USP']
  },

  urgent_care: {
    id: 'urgent_care',
    name: 'Urgent Care Center',
    description: 'Walk-in medical care for non-emergency conditions',
    icon: 'FiClock',
    color: 'orange',
    category: 'Acute Care',
    defaultFeatures: {
      patientManagement: true,
      walkInScheduling: true,
      prescriptions: true,
      basicLab: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'walkInScheduling'],
    optionalFeatures: ['inventory', 'xrayServices', 'occupationalHealth'],
    complianceRequirements: ['HIPAA', 'State Licensing', 'OSHA']
  },

  emergency_room: {
    id: 'emergency_room',
    name: 'Emergency Department',
    description: 'Emergency medical services and trauma care',
    icon: 'FiAlertTriangle',
    color: 'red',
    category: 'Emergency Care',
    defaultFeatures: {
      emergencyManagement: true,
      triageSystem: true,
      patientTracking: true,
      prescriptions: true,
      advancedLab: true,
      billing: true
    },
    requiredFeatures: ['emergencyManagement', 'triageSystem', 'patientTracking'],
    optionalFeatures: ['traumaRegistry', 'ambulanceTracking', 'bedManagement'],
    complianceRequirements: ['EMTALA', 'HIPAA', 'Joint Commission', 'State Licensing']
  },

  rehabilitation_center: {
    id: 'rehabilitation_center',
    name: 'Rehabilitation Center',
    description: 'Physical therapy and rehabilitation services',
    icon: 'FiTrendingUp',
    color: 'cyan',
    category: 'Rehabilitation',
    defaultFeatures: {
      patientManagement: true,
      therapyScheduling: true,
      progressTracking: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'therapyScheduling', 'progressTracking'],
    optionalFeatures: ['equipmentManagement', 'outcomesMeasurement'],
    complianceRequirements: ['HIPAA', 'State Licensing', 'Medicare']
  },

  mental_health_clinic: {
    id: 'mental_health_clinic',
    name: 'Mental Health Clinic',
    description: 'Psychiatric and psychological care services',
    icon: 'FiBrain',
    color: 'violet',
    category: 'Mental Health',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      mentalHealthAssessments: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'mentalHealthAssessments'],
    optionalFeatures: ['groupTherapy', 'crisisManagement', 'substanceAbuse'],
    complianceRequirements: ['HIPAA', 'State Licensing', 'SAMHSA', 'Suicide Prevention']
  },

  dental_clinic: {
    id: 'dental_clinic',
    name: 'Dental Clinic',
    description: 'Dental and oral health services',
    icon: 'FiSmile',
    color: 'lime',
    category: 'Dental',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      dentalCharting: true,
      imaging: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'dentalCharting'],
    optionalFeatures: ['inventory', 'labServices', 'orthodontics'],
    complianceRequirements: ['HIPAA', 'State Dental Board', 'OSHA', 'ADA']
  },

  veterinary_clinic: {
    id: 'veterinary_clinic',
    name: 'Veterinary Clinic',
    description: 'Animal health and veterinary services',
    icon: 'FiHeart',
    color: 'amber',
    category: 'Veterinary',
    defaultFeatures: {
      animalManagement: true,
      appointments: true,
      prescriptions: true,
      vaccinations: true,
      billing: true
    },
    requiredFeatures: ['animalManagement', 'appointments', 'vaccinations'],
    optionalFeatures: ['inventory', 'surgery', 'boarding'],
    complianceRequirements: ['State Licensing', 'DEA', 'Animal Welfare']
  },

  nursing_home: {
    id: 'nursing_home',
    name: 'Nursing Home',
    description: 'Long-term care facility for elderly residents',
    icon: 'FiHome',
    color: 'stone',
    category: 'Long-term Care',
    defaultFeatures: {
      residentManagement: true,
      careScheduling: true,
      medicationManagement: true,
      familyCommunication: true,
      billing: true
    },
    requiredFeatures: ['residentManagement', 'careScheduling', 'medicationManagement'],
    optionalFeatures: ['activityPlanning', 'nutritionManagement', 'socialServices'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'Life Safety Code']
  },

  assisted_living: {
    id: 'assisted_living',
    name: 'Assisted Living',
    description: 'Residential care with assistance for daily activities',
    icon: 'FiUsers',
    color: 'neutral',
    category: 'Long-term Care',
    defaultFeatures: {
      residentManagement: true,
      careScheduling: true,
      medicationReminders: true,
      familyCommunication: true,
      billing: true
    },
    requiredFeatures: ['residentManagement', 'careScheduling'],
    optionalFeatures: ['activityPlanning', 'nutritionManagement', 'transportationServices'],
    complianceRequirements: ['State Licensing', 'HIPAA', 'Assisted Living Regulations']
  },

  home_health: {
    id: 'home_health',
    name: 'Home Health Agency',
    description: 'Healthcare services provided in patients\' homes',
    icon: 'FiHome',
    color: 'sky',
    category: 'Home Care',
    defaultFeatures: {
      patientManagement: true,
      visitScheduling: true,
      caregiverManagement: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'visitScheduling', 'caregiverManagement'],
    optionalFeatures: ['mileageTracking', 'equipmentManagement', 'familyCommunication'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'OASIS']
  },

  ambulatory_surgery: {
    id: 'ambulatory_surgery',
    name: 'Ambulatory Surgery Center',
    description: 'Outpatient surgical procedures',
    icon: 'FiScissors',
    color: 'rose',
    category: 'Surgical',
    defaultFeatures: {
      patientManagement: true,
      surgeryScheduling: true,
      anesthesiaManagement: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'surgeryScheduling', 'anesthesiaManagement'],
    optionalFeatures: ['inventory', 'equipmentTracking', 'qualityMetrics'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'Joint Commission']
  },

  dialysis_center: {
    id: 'dialysis_center',
    name: 'Dialysis Center',
    description: 'Kidney dialysis treatment facility',
    icon: 'FiDroplet',
    color: 'blue',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      treatmentScheduling: true,
      vascularAccess: true,
      labTracking: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'treatmentScheduling', 'vascularAccess'],
    optionalFeatures: ['waterTesting', 'equipmentMaintenance', 'dietaryManagement'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'ESRD']
  },

  cancer_center: {
    id: 'cancer_center',
    name: 'Cancer Treatment Center',
    description: 'Oncology and cancer treatment services',
    icon: 'FiTarget',
    color: 'pink',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      treatmentScheduling: true,
      chemotherapyManagement: true,
      radiationTherapy: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'treatmentScheduling', 'chemotherapyManagement'],
    optionalFeatures: ['clinicalTrials', 'survivorshipPrograms', 'palliativeCare'],
    complianceRequirements: ['NRC', 'State Licensing', 'HIPAA', 'Joint Commission']
  },

  cardiac_center: {
    id: 'cardiac_center',
    name: 'Cardiac Center',
    description: 'Heart and cardiovascular care services',
    icon: 'FiHeart',
    color: 'red',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      cardiacTesting: true,
      interventionalProcedures: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'cardiacTesting'],
    optionalFeatures: ['rehabPrograms', 'deviceTracking', 'emergencyServices'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'ACC']
  },

  orthopedic_center: {
    id: 'orthopedic_center',
    name: 'Orthopedic Center',
    description: 'Bone, joint, and musculoskeletal care',
    icon: 'FiActivity',
    color: 'orange',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      surgeryScheduling: true,
      physicalTherapy: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'surgeryScheduling'],
    optionalFeatures: ['implantTracking', 'sportsInjuries', 'painManagement'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'AAOS']
  },

  eye_care_center: {
    id: 'eye_care_center',
    name: 'Eye Care Center',
    description: 'Ophthalmology and vision care services',
    icon: 'FiEye',
    color: 'indigo',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      visionTesting: true,
      surgeryScheduling: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'visionTesting'],
    optionalFeatures: ['contactLensServices', 'retinalImaging', 'glaucomaManagement'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'AAO']
  },

  womens_health_clinic: {
    id: 'womens_health_clinic',
    name: 'Women\'s Health Clinic',
    description: 'Gynecological and reproductive health services',
    icon: 'FiHeart',
    color: 'pink',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      prenatalCare: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'prenatalCare'],
    optionalFeatures: ['mammography', 'fertilityServices', 'menopauseManagement'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'ACOG']
  },

  pediatric_clinic: {
    id: 'pediatric_clinic',
    name: 'Pediatric Clinic',
    description: 'Medical care for infants, children, and adolescents',
    icon: 'FiUsers',
    color: 'green',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      growthTracking: true,
      immunizations: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'growthTracking', 'immunizations'],
    optionalFeatures: ['developmentalScreening', 'parentalEducation', 'wellChildVisits'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'AAP']
  },

  geriatric_clinic: {
    id: 'geriatric_clinic',
    name: 'Geriatric Clinic',
    description: 'Specialized care for elderly patients',
    icon: 'FiUsers',
    color: 'gray',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      cognitiveAssessment: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'cognitiveAssessment'],
    optionalFeatures: ['medicationReconciliation', 'fallPrevention', 'socialServices'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'AGS']
  },

  specialty_clinic: {
    id: 'specialty_clinic',
    name: 'Specialty Clinic',
    description: 'Specialized medical services and consultations',
    icon: 'FiTarget',
    color: 'purple',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      prescriptions: true,
      consultations: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'consultations'],
    optionalFeatures: ['referralManagement', 'specializedTesting', 'followUpCare'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'Specialty Board']
  },

  telehealth_provider: {
    id: 'telehealth_provider',
    name: 'Telehealth Provider',
    description: 'Remote healthcare services via technology',
    icon: 'FiMonitor',
    color: 'blue',
    category: 'Digital Health',
    defaultFeatures: {
      patientManagement: true,
      virtualAppointments: true,
      prescriptions: true,
      remoteMonitoring: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'virtualAppointments', 'remoteMonitoring'],
    optionalFeatures: ['chatServices', 'deviceIntegration', 'patientEducation'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'Telemedicine Regulations']
  },

  medical_research: {
    id: 'medical_research',
    name: 'Medical Research Facility',
    description: 'Clinical research and medical studies',
    icon: 'FiSearch',
    color: 'indigo',
    category: 'Research',
    defaultFeatures: {
      participantManagement: true,
      studyManagement: true,
      dataCollection: true,
      adverseEventReporting: true
    },
    requiredFeatures: ['participantManagement', 'studyManagement', 'dataCollection'],
    optionalFeatures: ['randomization', 'drugAccountability', 'regulatoryReporting'],
    complianceRequirements: ['FDA', 'GCP', 'HIPAA', 'IRB']
  },

  blood_bank: {
    id: 'blood_bank',
    name: 'Blood Bank',
    description: 'Blood collection, testing, and distribution services',
    icon: 'FiDroplet',
    color: 'red',
    category: 'Laboratory',
    defaultFeatures: {
      donorManagement: true,
      bloodTesting: true,
      inventoryTracking: true,
      distributionManagement: true
    },
    requiredFeatures: ['donorManagement', 'bloodTesting', 'inventoryTracking'],
    optionalFeatures: ['donorRecruitment', 'qualityControl', 'emergencyServices'],
    complianceRequirements: ['FDA', 'AABB', 'HIPAA', 'State Licensing']
  },

  organ_transplant: {
    id: 'organ_transplant',
    name: 'Organ Transplant Center',
    description: 'Organ transplantation and related services',
    icon: 'FiHeart',
    color: 'green',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      transplantScheduling: true,
      donorManagement: true,
      immunosuppressionTracking: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'transplantScheduling', 'donorManagement'],
    optionalFeatures: ['waitlistManagement', 'tissueTyping', 'followUpCare'],
    complianceRequirements: ['CMS', 'UNOS', 'HIPAA', 'State Licensing']
  },

  addiction_treatment: {
    id: 'addiction_treatment',
    name: 'Addiction Treatment Center',
    description: 'Substance abuse and addiction recovery services',
    icon: 'FiHeart',
    color: 'teal',
    category: 'Mental Health',
    defaultFeatures: {
      patientManagement: true,
      treatmentScheduling: true,
      counselingServices: true,
      medicationAssistedTreatment: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'treatmentScheduling', 'counselingServices'],
    optionalFeatures: ['groupTherapy', 'familySupport', 'relapsePrevention'],
    complianceRequirements: ['SAMHSA', 'DEA', 'HIPAA', 'State Licensing']
  },

  sleep_center: {
    id: 'sleep_center',
    name: 'Sleep Center',
    description: 'Sleep disorders diagnosis and treatment',
    icon: 'FiMoon',
    color: 'indigo',
    category: 'Specialty Care',
    defaultFeatures: {
      patientManagement: true,
      appointments: true,
      sleepStudies: true,
      cpapManagement: true,
      billing: true
    },
    requiredFeatures: ['patientManagement', 'appointments', 'sleepStudies'],
    optionalFeatures: ['homeStudies', 'equipmentRentals', 'followUpCare'],
    complianceRequirements: ['CMS', 'State Licensing', 'HIPAA', 'AASM']
  }
};

// Get organization types grouped by category
export const getOrganizationTypesByCategory = () => {
  const categories = {};
  
  Object.values(ORGANIZATION_TYPES).forEach(type => {
    if (!categories[type.category]) {
      categories[type.category] = [];
    }
    categories[type.category].push(type);
  });
  
  return categories;
};

// Get organization type by ID
export const getOrganizationType = (typeId) => {
  return ORGANIZATION_TYPES[typeId] || null;
};

// Get default features for organization type
export const getDefaultFeatures = (typeId) => {
  const type = ORGANIZATION_TYPES[typeId];
  return type ? type.defaultFeatures : {};
};

// Validate features for organization type
export const validateFeatures = (typeId, features) => {
  const type = ORGANIZATION_TYPES[typeId];
  if (!type) return false;
  
  // Check if all required features are present and enabled
  return type.requiredFeatures.every(feature => 
    features[feature] === true
  );
};

// Get organization categories
export const ORGANIZATION_CATEGORIES = [
  'Primary Care',
  'Acute Care',
  'Emergency Care',
  'Specialty Care',
  'Mental Health',
  'Dental',
  'Veterinary',
  'Long-term Care',
  'Home Care',
  'Surgical',
  'Diagnostic',
  'Pharmacy',
  'Rehabilitation',
  'Digital Health',
  'Research',
  'Laboratory'
];