import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { getApplicationData } from '../../../http/requests/applicator';

// Types
export interface Child {
  id: string;
  name: string;
  birthDate: string;
}

export interface MaritalData {
  maritalStatus: "single" | "married" | null;
  spouseName: string;
  hasChildren: boolean | null;
  children: Child[];
}

export interface EmploymentData {
  employerName: string;
  position: string;
  salary: string;
  startDate: string;
  hasContract: boolean | null;
  contractFile: string;
  isContractor: boolean;
  totalCompensation: string;
  isMultiplePayments: boolean;
}

export interface WorkConditionsData {
  dailyHours: string;
  weeklyDays: string;
  supervisorName: string;
  lastWorkDate: string;
  bases: string;
  loaFile: string | undefined;
}

export interface PostEmploymentData {
  hasWorked: boolean | null;
  previousJobs: any[];
  isCurrentlyWorking: boolean | null;
}

export interface EvidenceWitnessData {
  hasWitnesses: boolean | null;
  witnesses: any[];
  evidenceLinks: any[];
}

export interface ApplicationState {
  marital: MaritalData;
  employment: EmploymentData;
  workConditions: WorkConditionsData;
  postEmployment: PostEmploymentData;
  evidenceWitness: EvidenceWitnessData;
  isLoading: boolean;
  error: string | null;
}

// Action types
type ApplicationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MARITAL'; payload: Partial<MaritalData> }
  | { type: 'SET_EMPLOYMENT'; payload: Partial<EmploymentData> }
  | { type: 'SET_WORK_CONDITIONS'; payload: Partial<WorkConditionsData> }
  | { type: 'SET_POST_EMPLOYMENT'; payload: Partial<PostEmploymentData> }
  | { type: 'SET_EVIDENCE_WITNESS'; payload: Partial<EvidenceWitnessData> }
  | { type: 'LOAD_DATA'; payload: Partial<ApplicationState> }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: ApplicationState = {
  marital: {
    maritalStatus: null,
    spouseName: "",
    hasChildren: null,
    children: [],
  },
  employment: {
    employerName: "",
    position: "",
    salary: "",
    startDate: "",
    hasContract: null,
    contractFile: "",
    isContractor: false,
    totalCompensation: "",
    isMultiplePayments: false,
  },
  workConditions: {
    dailyHours: "",
    weeklyDays: "",
    supervisorName: "",
    lastWorkDate: "",
    bases: "",
    loaFile: undefined,
  },
  postEmployment: {
    hasWorked: null,
    previousJobs: [],
    isCurrentlyWorking: null,
  },
  evidenceWitness: {
    hasWitnesses: null,
    witnesses: [],
    evidenceLinks: [],
  },
  isLoading: false,
  error: null,
};

// Reducer
const applicationReducer = (
  state: ApplicationState,
  action: ApplicationAction
): ApplicationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MARITAL':
      return { 
        ...state, 
        marital: { ...state.marital, ...action.payload }
      };
    case 'SET_EMPLOYMENT':
      return { 
        ...state, 
        employment: { ...state.employment, ...action.payload }
      };
    case 'SET_WORK_CONDITIONS':
      return { 
        ...state, 
        workConditions: { ...state.workConditions, ...action.payload }
      };
    case 'SET_POST_EMPLOYMENT':
      return { 
        ...state, 
        postEmployment: { ...state.postEmployment, ...action.payload }
      };
    case 'SET_EVIDENCE_WITNESS':
      return { 
        ...state, 
        evidenceWitness: { ...state.evidenceWitness, ...action.payload }
      };
    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoading: false };
    case 'RESET_FORM':
      return { ...initialState };
    default:
      return state;
  }
};

// Context
interface ApplicationContextType {
  state: ApplicationState;
  dispatch: React.Dispatch<ApplicationAction>;
  actions: {
    setMarital: (data: Partial<MaritalData>) => void;
    setEmployment: (data: Partial<EmploymentData>) => void;
    setWorkConditions: (data: Partial<WorkConditionsData>) => void;
    setPostEmployment: (data: Partial<PostEmploymentData>) => void;
    setEvidenceWitness: (data: Partial<EvidenceWitnessData>) => void;
    loadData: () => Promise<void>;
    resetForm: () => void;
  };
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Provider component
interface ApplicationProviderProps {
  children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(applicationReducer, initialState);

  // Load existing data from backend
  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await getApplicationData();
      if (response && response.applicationData) {
        const apiData = response.applicationData;
        const loadedState: Partial<ApplicationState> = {};

        // Transform API data to context state
        apiData.forEach((section: any) => {
          if (section.section && section.data) {
            switch (section.section) {
              case 'marital':
                loadedState.marital = section.data;
                break;
              case 'employment':
                loadedState.employment = section.data;
                break;
              case 'workConditions':
                loadedState.workConditions = section.data;
                break;
              case 'postEmployment':
                loadedState.postEmployment = section.data;
                break;
              case 'evidenceWitness':
                loadedState.evidenceWitness = section.data;
                break;
            }
          }
        });

        dispatch({ type: 'LOAD_DATA', payload: loadedState });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading application data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Veriler yüklenirken hata oluştu.' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Actions
  const actions = {
    setMarital: (data: Partial<MaritalData>) => {
      dispatch({ type: 'SET_MARITAL', payload: data });
    },
    setEmployment: (data: Partial<EmploymentData>) => {
      dispatch({ type: 'SET_EMPLOYMENT', payload: data });
    },
    setWorkConditions: (data: Partial<WorkConditionsData>) => {
      dispatch({ type: 'SET_WORK_CONDITIONS', payload: data });
    },
    setPostEmployment: (data: Partial<PostEmploymentData>) => {
      dispatch({ type: 'SET_POST_EMPLOYMENT', payload: data });
    },
    setEvidenceWitness: (data: Partial<EvidenceWitnessData>) => {
      dispatch({ type: 'SET_EVIDENCE_WITNESS', payload: data });
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
    <ApplicationContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Hook to use context
export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}; 