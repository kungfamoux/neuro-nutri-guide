import { useState, useRef, useCallback } from 'react';
import { PatientData, AnalysisResult, analyzePatient, getHealthStatus } from '../services/api';

// Cache health status for 30 seconds
const HEALTH_CHECK_CACHE_TIME = 30 * 1000;

export const usePatientAnalysis = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'idle' | 'checking' | 'ready' | 'error'>('idle');
  
  // Store the last health check time and result
  const healthCheckRef = useRef({
    lastCheck: 0,
    isHealthy: false,
    inProgress: false,
  });

  const checkApiHealth = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Return cached result if still valid and not forcing a refresh
    if (!force && 
        now - healthCheckRef.current.lastCheck < HEALTH_CHECK_CACHE_TIME && 
        healthCheckRef.current.lastCheck !== 0) {
      return healthCheckRef.current.isHealthy;
    }

    // Prevent concurrent health checks
    if (healthCheckRef.current.inProgress) {
      return healthCheckRef.current.isHealthy;
    }

    healthCheckRef.current.inProgress = true;
    setApiStatus('checking');
    
    try {
      await getHealthStatus();
      healthCheckRef.current = {
        lastCheck: now,
        isHealthy: true,
        inProgress: false
      };
      setApiStatus('ready');
      setError(null);
      return true;
    } catch (err) {
      healthCheckRef.current = {
        lastCheck: now,
        isHealthy: false,
        inProgress: false
      };
      setApiStatus('error');
      const errorMessage = 'Unable to connect to the analysis service. Please try again later.';
      setError(errorMessage);
      return false;
    }
  }, []);

  const analyze = async (patientData: PatientData) => {
    if (loading) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Only check health if we don't have a recent successful check
      if (!healthCheckRef.current.isHealthy || 
          Date.now() - healthCheckRef.current.lastCheck > HEALTH_CHECK_CACHE_TIME) {
        const isHealthy = await checkApiHealth();
        if (!isHealthy) return null;
      }
      
      // Proceed with analysis
      const analysisResult = await analyzePatient(patientData);
      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred during analysis';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return {
    result,
    loading,
    error,
    apiStatus,
    analyze,
    reset,
    checkApiHealth,
  };
};

export default usePatientAnalysis;
