import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { getApplicationData } from '../../../http/requests/applicator';

// Types
export interface ContactInfo {
  firstName: string;
  lastName: string;
  email?: string;
  birthDate: string;
}

export interface RecognitionInfo {
  hasDocuments: boolean;
  files: string[]; // File URLs from backend
}

export interface PreApplicationState {
  contactInfo: ContactInfo;
  incidentDescription: string;
  incidentFiles: string[];
  passportFiles: string[];
  employmentFiles: string[];
  recognitionInfo: RecognitionInfo;
  paymentFiles: string[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type PreApplicationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONTACT_INFO'; payload: ContactInfo }
  | { type: 'SET_INCIDENT_DESCRIPTION'; payload: string }
  | { type: 'SET_INCIDENT_FILES'; payload: string[] }
  | { type: 'SET_PASSPORT_FILES'; payload: string[] }
  | { type: 'SET_EMPLOYMENT_FILES'; payload: string[] }
  | { type: 'SET_RECOGNITION_INFO'; payload: RecognitionInfo }
  | { type: 'SET_PAYMENT_FILES'; payload: string[] }
  | { type: 'LOAD_DATA'; payload: Partial<PreApplicationState> }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: PreApplicationState = {
  contactInfo: {
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
  },
  incidentDescription: '',
  incidentFiles: [],
  passportFiles: [],
  employmentFiles: [],
  recognitionInfo: { hasDocuments: false, files: [] },
  paymentFiles: [],
  isLoading: false,
  error: null,
};

// Reducer
const preApplicationReducer = (
  state: PreApplicationState,
  action: PreApplicationAction
): PreApplicationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONTACT_INFO':
      return { ...state, contactInfo: action.payload };
    case 'SET_INCIDENT_DESCRIPTION':
      return { ...state, incidentDescription: action.payload };
    case 'SET_INCIDENT_FILES':
      return { ...state, incidentFiles: action.payload };
    case 'SET_PASSPORT_FILES':
      return { ...state, passportFiles: action.payload };
    case 'SET_EMPLOYMENT_FILES':
      return { ...state, employmentFiles: action.payload };
    case 'SET_RECOGNITION_INFO':
      return { ...state, recognitionInfo: action.payload };
    case 'SET_PAYMENT_FILES':
      return { ...state, paymentFiles: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoading: false };
    case 'RESET_FORM':
      return { ...initialState };
    default:
      return state;
  }
};

// Context
interface PreApplicationContextType {
  state: PreApplicationState;
  dispatch: React.Dispatch<PreApplicationAction>;
  actions: {
    setContactInfo: (info: ContactInfo) => void;
    setIncidentDescription: (description: string) => void;
    setIncidentFiles: (files: string[]) => void;
    setPassportFiles: (files: string[]) => void;
    setEmploymentFiles: (files: string[]) => void;
    setRecognitionInfo: (info: RecognitionInfo) => void;
    setPaymentFiles: (files: string[]) => void;
    loadData: () => Promise<void>;
    resetForm: () => void;
  };
}

const PreApplicationContext = createContext<PreApplicationContextType | undefined>(undefined);

// Provider component
interface PreApplicationProviderProps {
  children: ReactNode;
}

export const PreApplicationProvider: React.FC<PreApplicationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(preApplicationReducer, initialState);

  // Load existing data from backend
  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await getApplicationData();
      if (response && response.preApplicationData) {
        const apiData = response.preApplicationData;
        const loadedState: Partial<PreApplicationState> = {};

        // Transform API data to context state
        apiData.forEach((section: any) => {
          if (section.section && section.data) {
            switch (section.section) {
              case 'contact':
                loadedState.contactInfo = section.data;
                break;
              case 'incident':
                loadedState.incidentDescription = section.data.incidentDescription || '';
                loadedState.incidentFiles = section.data.incidentFiles || [];
                break;
              case 'passport':
                loadedState.passportFiles = section.data.passportFiles || [];
                break;
              case 'employment':
                loadedState.employmentFiles = section.data.employmentFiles || [];
                break;
              case 'recognition':
                loadedState.recognitionInfo = {
                  hasDocuments: section.data.hasDocuments || false,
                  files: section.data.files || []
                };
                break;
              case 'payment':
                loadedState.paymentFiles = section.data.paymentFiles || [];
                break;
            }
          }
        });

        dispatch({ type: 'LOAD_DATA', payload: loadedState });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading pre-application data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Veriler yüklenirken hata oluştu.' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Actions
  const actions = {
    setContactInfo: (info: ContactInfo) => {
      dispatch({ type: 'SET_CONTACT_INFO', payload: info });
    },
    setIncidentDescription: (description: string) => {
      dispatch({ type: 'SET_INCIDENT_DESCRIPTION', payload: description });
    },
    setIncidentFiles: (files: string[]) => {
      dispatch({ type: 'SET_INCIDENT_FILES', payload: files });
    },
    setPassportFiles: (files: string[]) => {
      dispatch({ type: 'SET_PASSPORT_FILES', payload: files });
    },
    setEmploymentFiles: (files: string[]) => {
      dispatch({ type: 'SET_EMPLOYMENT_FILES', payload: files });
    },
    setRecognitionInfo: (info: RecognitionInfo) => {
      dispatch({ type: 'SET_RECOGNITION_INFO', payload: info });
    },
    setPaymentFiles: (files: string[]) => {
      dispatch({ type: 'SET_PAYMENT_FILES', payload: files });
    },
    loadData,
    resetForm: () => {
      dispatch({ type: 'RESET_FORM' });
    },
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  return (
    <PreApplicationContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </PreApplicationContext.Provider>
  );
};

// Hook to use context
export const usePreApplication = () => {
  const context = useContext(PreApplicationContext);
  if (context === undefined) {
    throw new Error('usePreApplication must be used within a PreApplicationProvider');
  }
  return context;
}; 