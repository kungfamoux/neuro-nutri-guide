from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import joblib

from .services.model_trainer import NutritionStrokeModel, train_and_save_model

app = FastAPI(
    title="NeuroNutri Guide API",
    description="API for stroke risk prediction and nutrition recommendations",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class PatientData(BaseModel):
    age: float
    gender: str
    bmi: float
    hypertension: int = 0
    heart_disease: int = 0
    avg_glucose_level: float
    smoking_status: str
    residence_type: str = "Urban"
    work_type: str = "Private"
    nutrition_data: Optional[Dict[str, float]] = None

class PredictionResult(BaseModel):
    stroke_risk: float
    risk_category: str
    recommendations: List[str]
    nutrition_goals: Dict[str, Any]

# Load models on startup
@app.on_event("startup")
async def load_models():
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    # Check if models exist, if not, train them
    model_files = ["stroke_model.joblib", "nutrition_scaler.joblib", "encoders.joblib"]
    if not all(os.path.exists(os.path.join(models_dir, f)) for f in model_files):
        print("Training models...")
        train_and_save_model()
    
    # Load the models
    app.state.model = NutritionStrokeModel.load_models(models_dir)

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to NeuroNutri Guide API"}

@app.post("/analyze", response_model=PredictionResult)
async def analyze_health(patient_data: PatientData):
    try:
        # Convert input data to dict
        input_data = patient_data.dict()
        
        # Get stroke risk prediction
        stroke_result = app.state.model.predict_stroke_risk(input_data)
        
        # Add stroke risk to input data for nutrition recommendations
        input_data['stroke_risk'] = stroke_result['stroke_risk']
        
        # Get nutrition recommendations
        nutrition_result = app.state.model.get_nutrition_recommendations(input_data)
        
        # Combine results
        return {
            "stroke_risk": stroke_result['stroke_risk'],
            "risk_category": stroke_result['risk_category'],
            "recommendations": nutrition_result['recommendations'],
            "nutrition_goals": nutrition_result['daily_goals']
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": hasattr(app.state, 'model')}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
