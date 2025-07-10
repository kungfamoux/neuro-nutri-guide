import React, { createContext, useContext, ReactNode } from 'react';
import { PatientData, AnalysisResult } from '../services/api';
import usePatientAnalysis from '../hooks/usePatientAnalysis';

interface AnalysisContextType {
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  apiStatus: 'idle' | 'checking' | 'ready' | 'error';
  analyzePatient: (data: PatientData) => Promise<AnalysisResult | null>;
  resetAnalysis: () => void;
  checkApiHealth: () => Promise<boolean>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    result, 
    loading, 
    error, 
    apiStatus, 
    analyze, 
    reset, 
    checkApiHealth 
  } = usePatientAnalysis();

  const value = {
    result,
    loading,
    error,
    apiStatus,
    analyzePatient: analyze,
    resetAnalysis: reset,
    checkApiHealth,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export default AnalysisContext;
