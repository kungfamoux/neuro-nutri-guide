import axios from 'axios';

export interface NutritionData {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  vitamin_a_iu: number;
  vitamin_c_mg: number;
  calcium_mg: number;
  iron_mg: number;
}

export interface PatientData {
  age: number;
  gender: 'male' | 'female';  // String type to match backend
  bmi: number;
  hypertension: 0 | 1;
  heart_disease: 0 | 1;
  avg_glucose_level: number;
  smoking_status: 'never smoked' | 'formerly smoked' | 'smokes' | 'Unknown';
  residence_type: 'Urban' | 'Rural';
  work_type: 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked';
  nutrition_data?: NutritionData;
}

export interface AnalysisResult {
  stroke_risk: number;
  risk_category: 'Low' | 'Moderate' | 'High';
  recommendations: string[];
  nutrition_goals: {
    calories: number;
    protein_g: number;
    fiber_g: number;
    sodium_mg: number;
    sugar_g: number;
    calcium_mg: number;
    vitamin_d_iu: number;
  };
  message?: string;
}

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzePatient = async (patientData: PatientData): Promise<AnalysisResult> => {
  try {
    // Convert empty strings to 0 for numeric fields
    const toNumber = (value: any) => {
      if (value === '' || value === null || value === undefined) return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    // Map frontend values to backend expected values (using lowercase to match model training)
    const genderMapping = {
      'male': 'male',
      'female': 'female'
    } as const;

    const smokingStatusMapping = {
      'never': 'never smoked',
      'formerly': 'formerly smoked',
      'smokes': 'smokes',
      'unknown': 'Unknown'
    } as const;

    // Type-safe value extraction with defaults
    const getGender = (gender?: string): string => {
      if (!gender) return 'male';
      return genderMapping[gender as keyof typeof genderMapping] || 'male';
    };

    const getSmokingStatus = (status?: string): string => {
      if (!status) return 'never smoked';
      return smokingStatusMapping[status as keyof typeof smokingStatusMapping] || 'never smoked';
    };

    const getWorkType = (workType?: string): string => {
      const workTypeMapping: Record<string, string> = {
        'self_employed': 'Self-employed',
        'govt_job': 'Govt_job',
        'never_worked': 'Never_worked',
        'children': 'children',
        'private': 'Private'
      };
      if (!workType) return 'Private';
      return workTypeMapping[workType] || 'Private';
    };

    // Prepare the request data with all required fields
    const requestData: any = {
      age: toNumber(patientData.age),
      gender: getGender(patientData.gender),
      bmi: toNumber(patientData.bmi),
      hypertension: patientData.hypertension ? 1 : 0,
      heart_disease: patientData.heart_disease ? 1 : 0,
      avg_glucose_level: toNumber(patientData.avg_glucose_level),
      smoking_status: getSmokingStatus(patientData.smoking_status),
      residence_type: patientData.residence_type === 'Rural' ? 'Rural' : 'Urban',
      work_type: getWorkType(patientData.work_type),
      nutrition_data: {
        calories: toNumber(patientData.nutrition_data?.calories),
        protein_g: toNumber(patientData.nutrition_data?.protein_g),
        fat_g: toNumber(patientData.nutrition_data?.fat_g),
        carbs_g: toNumber(patientData.nutrition_data?.carbs_g),
        fiber_g: toNumber(patientData.nutrition_data?.fiber_g),
        sugar_g: toNumber(patientData.nutrition_data?.sugar_g),
        sodium_mg: toNumber(patientData.nutrition_data?.sodium_mg),
        potassium_mg: toNumber(patientData.nutrition_data?.potassium_mg),
        cholesterol_mg: toNumber(patientData.nutrition_data?.cholesterol_mg),
        vitamin_a_iu: toNumber(patientData.nutrition_data?.vitamin_a_iu),
        vitamin_c_mg: toNumber(patientData.nutrition_data?.vitamin_c_mg),
        calcium_mg: toNumber(patientData.nutrition_data?.calcium_mg),
        iron_mg: toNumber(patientData.nutrition_data?.iron_mg),
      }
    };

    // Ensure all numeric fields are numbers and not strings
    const numericFields = ['age', 'bmi', 'avg_glucose_level', 'hypertension', 'heart_disease'];
    numericFields.forEach(field => {
      if (requestData[field] !== undefined) {
        requestData[field] = Number(requestData[field]);
      }
    });

    console.log('Sending request to /analyze with data:', JSON.stringify(requestData, null, 2));
    
    try {
      const response = await api.post('/analyze', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500, // Don't throw for 4xx errors
      });

      console.log('Received response from /analyze:', JSON.stringify(response.data, null, 2));
      
      if (response.status >= 400) {
        throw new Error(response.data?.message || 'Failed to analyze patient data');
      }
      
      // Ensure the response has the expected format
      if (!response.data || typeof response.data.stroke_risk === 'undefined') {
        throw new Error('Invalid response format from server');
      }
      
      // Transform the response to match AnalysisResult interface
      const result: AnalysisResult = {
        stroke_risk: parseFloat(response.data.stroke_risk) || 0,
        risk_category: response.data.risk_category || 'Low',
        recommendations: Array.isArray(response.data.recommendations) 
          ? response.data.recommendations 
          : ['No specific recommendations available.'],
        nutrition_goals: {
          calories: response.data.nutrition_goals?.calories || 2000,
          protein_g: response.data.nutrition_goals?.protein_g || 50,
          fiber_g: response.data.nutrition_goals?.fiber_g || 25,
          sodium_mg: response.data.nutrition_goals?.sodium_mg || 2300,
          sugar_g: response.data.nutrition_goals?.sugar_g || 50,
          calcium_mg: response.data.nutrition_goals?.calcium_mg || 1000,
          vitamin_d_iu: response.data.nutrition_goals?.vitamin_d_iu || 600
        },
        message: response.data.message
      };
      
      return result;
    } catch (error: any) {
      console.error('Error in analyzePatient:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to analyze patient data');
    }
  } catch (error: any) {
    console.error('Error analyzing patient data:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.detail || 
                         error.response.data?.message || 
                         JSON.stringify(error.response.data);
      
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      throw new Error(`API Error (${error.response.status}): ${errorMessage}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from the server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

export const getHealthStatus = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

export const getModelMetrics = async () => {
  try {
    const response = await api.get('/metrics');
    return response.data.metrics || null;
  } catch (error) {
    console.error('Error fetching model metrics:', error);
    return null;
  }
};

export default {
  analyzePatient,
  getHealthStatus,
  getModelMetrics,
};
