import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientData, NutritionData } from '../../services/api';
import { useAnalysis } from '../../contexts/AnalysisContext';

type FormData = Omit<PatientData, 'age' | 'bmi' | 'avg_glucose_level' | 'nutrition_data'> & {
  age: string | number;
  bmi: string | number;
  avg_glucose_level: string | number;
  nutrition_data: Partial<NutritionData>;
};

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { analyzePatient, error, apiStatus, result, loading } = useAnalysis();
  
  const initialNutritionData: NutritionData = {
    calories: 2000,
    protein_g: 50,
    fat_g: 70,
    carbs_g: 250,
    fiber_g: 25,
    sugar_g: 50,
    sodium_mg: 2300,
    potassium_mg: 3500,
    cholesterol_mg: 200,
    vitamin_a_iu: 5000,
    vitamin_c_mg: 90,
    calcium_mg: 1000,
    iron_mg: 8
  };

  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: 'male',
    bmi: '',
    hypertension: 0,
    heart_disease: 0,
    avg_glucose_level: '',
    smoking_status: 'never smoked',
    residence_type: 'Urban',
    work_type: 'Private',
    nutrition_data: { ...initialNutritionData }
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Navigate to results when result is available
  useEffect(() => {
    if (result && !loading) {
      navigate('/patient/results');
    }
  }, [result, navigate, loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      // Only update if the value is a valid number or empty string
      if (value === '' || !isNaN(Number(value))) {
        setFormData(prev => ({
          ...prev,
          [name]: value === '' ? '' : parseFloat(value)
        }));
      }
      return;
    }
    
    // Handle checkbox inputs
    if (name === 'hypertension' || name === 'heart_disease') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked ? 1 : 0
      }));
      return;
    }
    
    // Handle other inputs
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nutritionField = name.replace('nutrition_', '') as keyof NutritionData;
    const numValue = parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      nutrition_data: {
        ...prev.nutrition_data,
        [nutritionField]: numValue
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Prepare submission data with proper number handling
    const prepareNumber = (value: string | number, defaultValue: number = 0): number => {
      if (value === '' || value === null || value === undefined) return defaultValue;
      const num = typeof value === 'string' ? parseFloat(value) : value;
      return isNaN(num) ? defaultValue : num;
    };
    
    // Convert form data to the expected PatientData type
    const submissionData: PatientData = {
      ...formData,
      age: prepareNumber(formData.age),
      bmi: prepareNumber(formData.bmi),
      avg_glucose_level: prepareNumber(formData.avg_glucose_level),
      // Ensure nutrition_data is always an object with proper number values
      nutrition_data: (() => {
        const nutrition = formData.nutrition_data || {};
        return {
          calories: prepareNumber(nutrition.calories, 0),
          protein_g: prepareNumber(nutrition.protein_g, 0),
          fat_g: prepareNumber(nutrition.fat_g, 0),
          carbs_g: prepareNumber(nutrition.carbs_g, 0),
          fiber_g: prepareNumber(nutrition.fiber_g, 0),
          sugar_g: prepareNumber(nutrition.sugar_g, 0),
          sodium_mg: prepareNumber(nutrition.sodium_mg, 0),
          potassium_mg: prepareNumber(nutrition.potassium_mg, 0),
          cholesterol_mg: prepareNumber(nutrition.cholesterol_mg, 0),
          vitamin_a_iu: prepareNumber(nutrition.vitamin_a_iu, 0),
          vitamin_c_mg: prepareNumber(nutrition.vitamin_c_mg, 0),
          calcium_mg: prepareNumber(nutrition.calcium_mg, 0),
          iron_mg: prepareNumber(nutrition.iron_mg, 0)
        };
      })()
    };
    
    // Validate required fields
    if (submissionData.age <= 0 || submissionData.bmi <= 0 || submissionData.avg_glucose_level <= 0) {
      setFormError('Please fill in all required fields with valid numbers.');
      return;
    }
    
    try {
      await analyzePatient(submissionData);
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormError('Failed to submit form. Please try again.');
    }
  };

  // Helper function to check if a form field has a valid positive number
  const isValidNumber = (value: string | number): boolean => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && num > 0;
  };

  const isFormValid = 
    isValidNumber(formData.age) && 
    isValidNumber(formData.bmi) && 
    isValidNumber(formData.avg_glucose_level);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Patient Information</h2>
      
      {(error || formError) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error || formError}
        </div>
      )}

      {apiStatus === 'checking' && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Connecting to analysis service...
        </div>
      )}

      {apiStatus === 'error' && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Warning: Unable to connect to the analysis service. Some features may be limited.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-gray-700 mb-1">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              max="120"
              step="1"
              className="w-full p-2 border rounded"
              aria-required="true"
              aria-label="Patient age in years"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter age in years (e.g., 35)</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-gray-700 mb-1">BMI</label>
            <input
              type="number"
              id="bmi"
              name="bmi"
              value={formData.bmi}
              onChange={handleChange}
              placeholder="e.g., 25.5"
              className="w-full p-2 border rounded"
              aria-required="true"
              aria-label="Body Mass Index (BMI)"
              required
              step="0.1"
              min="10"
              max="60"
            />
            <p className="text-xs text-gray-500 mt-1">Enter BMI (e.g., 25.5)</p>
          </div>

          <div className="form-group">
            <label className="block text-gray-700 mb-1">Average Glucose Level (mg/dL)</label>
            <input
              type="number"
              id="avg_glucose_level"
              name="avg_glucose_level"
              value={formData.avg_glucose_level}
              onChange={handleChange}
              placeholder="e.g., 120"
              className="w-full p-2 border rounded"
              aria-required="true"
              aria-label="Average glucose level in mg/dL"
              required
              min="50"
              max="300"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">Enter average glucose level (e.g., 120 mg/dL)</p>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hypertension"
                checked={formData.hypertension === 1}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Hypertension</span>
            </label>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="heart_disease"
                checked={formData.heart_disease === 1}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Heart Disease</span>
            </label>
          </div>

          <div className="form-group">
            <label className="block text-gray-700 mb-1">Smoking Status</label>
            <select
              id="smoking_status"
              name="smoking_status"
              value={formData.smoking_status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              aria-label="Smoking status"
            >
              <option value="never smoked">Never Smoked</option>
              <option value="formerly smoked">Formerly Smoked</option>
              <option value="smokes">Smokes</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-gray-700 mb-1">Residence Type</label>
            <select
              id="residence_type"
              name="residence_type"
              value={formData.residence_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              aria-label="Type of residence"
            >
              <option value="Urban">Urban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-gray-700 mb-1">Work Type</label>
            <select
              id="work_type"
              name="work_type"
              value={formData.work_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              aria-label="Type of work"
            >
              <option value="Never_worked">Never Worked</option>
              <option value="Private">Private</option>
              <option value="Self-employed">Self-employed</option>
              <option value="children">Children</option>
              <option value="Govt_job">Government Job</option>
            </select>
          </div>
        </div>

        {/* Nutrition Data Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Nutrition Intake</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  id="nutrition_calories"
                  name="nutrition_calories"
                  value={formData.nutrition_data?.calories || ''}
                  onChange={handleNutritionChange}
                  placeholder="e.g., 2000"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">Daily energy intake (e.g., 2000 kcal)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  id="nutrition_protein_g"
                  name="nutrition_protein_g"
                  value={formData.nutrition_data?.protein_g || ''}
                  onChange={handleNutritionChange}
                  placeholder="e.g., 70"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Protein in grams (e.g., 70g daily)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbohydrates (g)</label>
                <input
                  type="number"
                  id="nutrition_carbs_g"
                  name="nutrition_carbs_g"
                  value={formData.nutrition_data?.carbs_g || ''}
                  onChange={handleNutritionChange}
                  placeholder="e.g., 250"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Carbs in grams (e.g., 250g daily)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                <input
                  type="number"
                  id="nutrition_fat_g"
                  name="nutrition_fat_g"
                  value={formData.nutrition_data?.fat_g || ''}
                  onChange={handleNutritionChange}
                  placeholder="e.g., 65"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Fat in grams (e.g., 65g daily)</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiber (g)</label>
                <input
                  type="number"
                  id="nutrition_fiber_g"
                  name="nutrition_fiber_g"
                  value={formData.nutrition_data?.fiber_g || ''}
                  onChange={handleNutritionChange}
                  placeholder="e.g., 25"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Dietary fiber in grams (e.g., 25g daily)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sugar (g)</label>
                <input
                  type="number"
                  id="nutrition_sugar_g"
                  name="nutrition_sugar_g"
                  value={formData.nutrition_data?.sugar_g || ''}
                  onChange={handleNutritionChange}
                  placeholder="e.g., 30"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Added sugar in grams (e.g., 30g daily max)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sodium (mg)</label>
                <input
                  type="number"
                  id="nutrition_sodium_mg"
                  name="nutrition_sodium_mg"
                  value={formData.nutrition_data?.sodium_mg || ''}
                  onChange={handleNutritionChange}
                  placeholder="e.g., 1500"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">Sodium in milligrams (e.g., 1500mg daily)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (mg)</label>
                <input
                  type="number"
                  id="nutrition_potassium_mg"
                  name="nutrition_potassium_mg"
                  value={formData.nutrition_data?.potassium_mg || ''}
                  onChange={handleNutritionChange}
                  placeholder="e.g., 3500"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">Potassium in milligrams (e.g., 3500mg daily)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol (mg)</label>
              <input
                type="number"
                id="nutrition_cholesterol_mg"
                name="nutrition_cholesterol_mg"
                value={formData.nutrition_data?.cholesterol_mg || ''}
                onChange={handleNutritionChange}
                placeholder="e.g., 200"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">Cholesterol in milligrams (e.g., 200mg daily max)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vitamin A (IU)</label>
              <input
                type="number"
                id="nutrition_vitamin_a_iu"
                name="nutrition_vitamin_a_iu"
                value={formData.nutrition_data?.vitamin_a_iu || ''}
                onChange={handleNutritionChange}
                placeholder="e.g., 3000"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                step="100"
              />
              <p className="text-xs text-gray-500 mt-1">Vitamin A in IU (e.g., 3000 IU daily)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vitamin C (mg)</label>
              <input
                type="number"
                id="nutrition_vitamin_c_mg"
                name="nutrition_vitamin_c_mg"
                value={formData.nutrition_data?.vitamin_c_mg || ''}
                onChange={handleNutritionChange}
                placeholder="e.g., 90"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">Vitamin C in milligrams (e.g., 90mg daily)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calcium (mg)</label>
              <input
                type="number"
                id="nutrition_calcium_mg"
                name="nutrition_calcium_mg"
                value={formData.nutrition_data?.calcium_mg || ''}
                onChange={handleNutritionChange}
                placeholder="e.g., 1000"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                step="10"
              />
              <p className="text-xs text-gray-500 mt-1">Calcium in milligrams (e.g., 1000mg daily)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Iron (mg)</label>
              <input
                type="number"
                id="nutrition_iron_mg"
                name="nutrition_iron_mg"
                value={formData.nutrition_data?.iron_mg || ''}
                onChange={handleNutritionChange}
                placeholder="e.g., 8"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">Iron in milligrams (e.g., 8mg for men, 18mg for women)</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !isFormValid || apiStatus === 'error'}
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading || !isFormValid || apiStatus === 'error'
                ? 'bg-gray-400 cursor-not-allowed opacity-75'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            aria-label={loading ? 'Processing your request' : 'Submit patient data for analysis'}
          >
            {loading ? 'Analyzing...' : 'Analyze Stroke Risk'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
