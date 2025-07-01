import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Types
interface School {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  logo?: string;
  motto?: string;
  type: 'Public' | 'Private' | 'International' | 'Montessori' | 'NGO';
  level: string[];
  academicYear: {
    current: string;
    startDate: string;
    endDate: string;
  };
  terms: Term[];
  gradingSystem: {
    type: 'Percentage' | 'Letter' | 'Custom';
    scale: GradeScale[];
    passMarkDefault: number;
  };
  subjects: Subject[];
  classes: Class[];
  settings: {
    allowParentAccess: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
    reportCardTemplate: string;
    language: string;
    currency: string;
  };
}

interface Term {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface GradeScale {
  grade: string;
  minScore: number;
  maxScore: number;
  description: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
  level: string;
  isCore: boolean;
  passMark: number;
}

interface Class {
  _id: string;
  name: string;
  level: string;
  capacity: number;
  classTeacher?: string;
}

interface SchoolState {
  school: School | null;
  isLoading: boolean;
  error: string | null;
}

interface SchoolContextType extends SchoolState {
  fetchSchool: () => Promise<void>;
  updateSchoolProfile: (schoolData: Partial<School>) => Promise<void>;
  updateSchoolSettings: (settings: Partial<School['settings']>) => Promise<void>;
  addSubject: (subject: Omit<Subject, '_id'>) => Promise<void>;
  updateSubject: (subjectId: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
  addClass: (classData: Omit<Class, '_id'>) => Promise<void>;
  updateClass: (classId: string, classData: Partial<Class>) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
  addTerm: (term: Omit<Term, '_id'>) => Promise<void>;
  updateTerm: (termId: string, term: Partial<Term>) => Promise<void>;
  activateTerm: (termId: string) => Promise<void>;
  updateGradingSystem: (gradingSystem: School['gradingSystem']) => Promise<void>;
}

// Actions
type SchoolAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SCHOOL'; payload: School }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_SCHOOL'; payload: Partial<School> }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: { subjectId: string; subject: Partial<Subject> } }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: { classId: string; classData: Partial<Class> } }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'ADD_TERM'; payload: Term }
  | { type: 'UPDATE_TERM'; payload: { termId: string; term: Partial<Term> } }
  | { type: 'ACTIVATE_TERM'; payload: string };

// Initial state
const initialState: SchoolState = {
  school: null,
  isLoading: false,
  error: null,
};

// Reducer
const schoolReducer = (state: SchoolState, action: SchoolAction): SchoolState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_SCHOOL':
      return {
        ...state,
        school: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_SCHOOL':
      return {
        ...state,
        school: state.school ? { ...state.school, ...action.payload } : null,
      };
    case 'ADD_SUBJECT':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              subjects: [...state.school.subjects, action.payload],
            }
          : null,
      };
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              subjects: state.school.subjects.map((subject) =>
                subject._id === action.payload.subjectId
                  ? { ...subject, ...action.payload.subject }
                  : subject
              ),
            }
          : null,
      };
    case 'DELETE_SUBJECT':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              subjects: state.school.subjects.filter(
                (subject) => subject._id !== action.payload
              ),
            }
          : null,
      };
    case 'ADD_CLASS':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              classes: [...state.school.classes, action.payload],
            }
          : null,
      };
    case 'UPDATE_CLASS':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              classes: state.school.classes.map((cls) =>
                cls._id === action.payload.classId
                  ? { ...cls, ...action.payload.classData }
                  : cls
              ),
            }
          : null,
      };
    case 'DELETE_CLASS':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              classes: state.school.classes.filter(
                (cls) => cls._id !== action.payload
              ),
            }
          : null,
      };
    case 'ADD_TERM':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              terms: [...state.school.terms, action.payload],
            }
          : null,
      };
    case 'UPDATE_TERM':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              terms: state.school.terms.map((term) =>
                term._id === action.payload.termId
                  ? { ...term, ...action.payload.term }
                  : term
              ),
            }
          : null,
      };
    case 'ACTIVATE_TERM':
      return {
        ...state,
        school: state.school
          ? {
              ...state.school,
              terms: state.school.terms.map((term) => ({
                ...term,
                isActive: term._id === action.payload,
              })),
            }
          : null,
      };
    default:
      return state;
  }
};

// Context
const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Provider
export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(schoolReducer, initialState);
  const { token, isAuthenticated } = useAuth();

  // Add auth token to requests
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch school data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchSchool();
    }
  }, [isAuthenticated, token]);

  // Fetch school function
  const fetchSchool = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/schools/me');
      dispatch({ type: 'SET_SCHOOL', payload: response.data.data.school });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch school data';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  // Update school profile
  const updateSchoolProfile = async (schoolData: Partial<School>) => {
    try {
      const response = await api.put('/schools/profile', schoolData);
      dispatch({ type: 'UPDATE_SCHOOL', payload: response.data.data.school });
      toast.success('School profile updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update school profile';
      toast.error(message);
      throw error;
    }
  };

  // Update school settings
  const updateSchoolSettings = async (settings: Partial<School['settings']>) => {
    try {
      const response = await api.put('/schools/settings', { settings });
      dispatch({ type: 'UPDATE_SCHOOL', payload: response.data.data.school });
      toast.success('School settings updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update school settings';
      toast.error(message);
      throw error;
    }
  };

  // Add subject
  const addSubject = async (subject: Omit<Subject, '_id'>) => {
    try {
      const response = await api.post('/schools/subjects', subject);
      dispatch({ type: 'ADD_SUBJECT', payload: response.data.data.subject });
      toast.success('Subject added successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add subject';
      toast.error(message);
      throw error;
    }
  };

  // Update subject
  const updateSubject = async (subjectId: string, subject: Partial<Subject>) => {
    try {
      const response = await api.put(`/schools/subjects/${subjectId}`, subject);
      dispatch({
        type: 'UPDATE_SUBJECT',
        payload: { subjectId, subject: response.data.data.subject },
      });
      toast.success('Subject updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update subject';
      toast.error(message);
      throw error;
    }
  };

  // Delete subject
  const deleteSubject = async (subjectId: string) => {
    try {
      await api.delete(`/schools/subjects/${subjectId}`);
      dispatch({ type: 'DELETE_SUBJECT', payload: subjectId });
      toast.success('Subject deleted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete subject';
      toast.error(message);
      throw error;
    }
  };

  // Add class
  const addClass = async (classData: Omit<Class, '_id'>) => {
    try {
      const response = await api.post('/schools/classes', classData);
      dispatch({ type: 'ADD_CLASS', payload: response.data.data.class });
      toast.success('Class added successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add class';
      toast.error(message);
      throw error;
    }
  };

  // Update class
  const updateClass = async (classId: string, classData: Partial<Class>) => {
    try {
      const response = await api.put(`/schools/classes/${classId}`, classData);
      dispatch({
        type: 'UPDATE_CLASS',
        payload: { classId, classData: response.data.data.class },
      });
      toast.success('Class updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update class';
      toast.error(message);
      throw error;
    }
  };

  // Delete class
  const deleteClass = async (classId: string) => {
    try {
      await api.delete(`/schools/classes/${classId}`);
      dispatch({ type: 'DELETE_CLASS', payload: classId });
      toast.success('Class deleted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete class';
      toast.error(message);
      throw error;
    }
  };

  // Add term
  const addTerm = async (term: Omit<Term, '_id'>) => {
    try {
      const response = await api.post('/schools/terms', term);
      dispatch({ type: 'ADD_TERM', payload: response.data.data.term });
      toast.success('Term added successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add term';
      toast.error(message);
      throw error;
    }
  };

  // Update term
  const updateTerm = async (termId: string, term: Partial<Term>) => {
    try {
      const response = await api.put(`/schools/terms/${termId}`, term);
      dispatch({
        type: 'UPDATE_TERM',
        payload: { termId, term: response.data.data.term },
      });
      toast.success('Term updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update term';
      toast.error(message);
      throw error;
    }
  };

  // Activate term
  const activateTerm = async (termId: string) => {
    try {
      await api.put(`/schools/terms/${termId}/activate`);
      dispatch({ type: 'ACTIVATE_TERM', payload: termId });
      toast.success('Term activated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to activate term';
      toast.error(message);
      throw error;
    }
  };

  // Update grading system
  const updateGradingSystem = async (gradingSystem: School['gradingSystem']) => {
    try {
      const response = await api.put('/schools/grading-system', { gradingSystem });
      dispatch({ type: 'UPDATE_SCHOOL', payload: response.data.data.school });
      toast.success('Grading system updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update grading system';
      toast.error(message);
      throw error;
    }
  };

  const value: SchoolContextType = {
    ...state,
    fetchSchool,
    updateSchoolProfile,
    updateSchoolSettings,
    addSubject,
    updateSubject,
    deleteSubject,
    addClass,
    updateClass,
    deleteClass,
    addTerm,
    updateTerm,
    activateTerm,
    updateGradingSystem,
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
};

// Hook to use school context
export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

export default SchoolContext;