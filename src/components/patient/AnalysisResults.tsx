import React from 'react';
import { useAnalysis } from '../../contexts/AnalysisContext';
import ProgressBar from './ProgressBar';

const AnalysisResults: React.FC = () => {
  const { result, loading } = useAnalysis();

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Analyzing patient data...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No analysis results available. Please submit the form to get started.</p>
      </div>
    );
  }

  const { stroke_risk, risk_category, recommendations, nutrition_goals } = result;
  const riskPercentage = (stroke_risk * 100).toFixed(1);
  const progressValue = stroke_risk > 0.2 ? stroke_risk : 0.2; // Ensure minimum visibility

  // Format nutrition goals for display
  const formatNutritionGoal = (value: number, unit: string) => {
    return value.toLocaleString() + unit;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Your Health Analysis</h2>
      
      {/* Risk Assessment Section */}
      <div className="mb-10 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Stroke Risk Assessment</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/3">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{riskPercentage}%</div>
              <div className={`px-4 py-1 rounded-full text-sm font-medium ${
                risk_category === 'High' ? 'bg-red-100 text-red-800' :
                risk_category === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk_category} Risk
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <ProgressBar
              value={progressValue}
              label={`Stroke risk level: ${risk_category} (${riskPercentage}%)`}
              className={`h-6 ${risk_category === 'High' ? 'bg-red-100' : risk_category === 'Moderate' ? 'bg-yellow-100' : 'bg-green-100'}`}
            />
            <p className="mt-3 text-sm text-gray-600">
              Based on your health profile, you have a {risk_category.toLowerCase()} risk of stroke.
              {risk_category === 'High' ? ' Please consult with a healthcare professional.' : 
               risk_category === 'Moderate' ? ' Consider making lifestyle changes to reduce your risk.' :
               ' Maintain your healthy habits!'}
            </p>
          </div>
        </div>
      </div>

      {/* Nutrition Goals Section */}
      {nutrition_goals && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Nutrition Goals</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(nutrition_goals).map(([key, value]) => (
              <div key={key} className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="text-xl font-bold text-blue-600 mt-1">
                  {typeof value === 'number' 
                    ? formatNutritionGoal(value, key === 'calories' ? '' : 'g')
                    : value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Personalized Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
                <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Print Results
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          New Analysis
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
