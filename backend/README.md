# NeuroNutri Guide Backend

This is the backend service for the NeuroNutri Guide application, providing machine learning models for stroke risk prediction and personalized nutrition recommendations.

## Features

- **Stroke Risk Prediction**: Predicts the risk of stroke based on health metrics
- **Personalized Nutrition Recommendations**: Provides dietary recommendations based on health status
- **Nutrition Goals**: Suggests daily nutritional targets
- **RESTful API**: Easy-to-use endpoints for integration with frontend

## Setup

1. **Prerequisites**
   - Python 3.8+
   - pip (Python package manager)

2. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory with any required environment variables.

## Running the Application

1. **Development Mode**
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`

2. **Production Mode**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Health Check
- `GET /health` - Check if the service is running

### Analyze Health Data
- `POST /analyze` - Analyze health data and get recommendations

#### Request Body Example
```json
{
  "age": 45,
  "gender": "male",
  "bmi": 28.5,
  "hypertension": 0,
  "heart_disease": 0,
  "avg_glucose_level": 95.0,
  "smoking_status": "never_smoked",
  "residence_type": "Urban",
  "work_type": "Private"
}
```

#### Response Example
```json
{
  "stroke_risk": 0.15,
  "risk_category": "Low",
  "recommendations": [
    "Consume at least 5 servings of fruits and vegetables daily.",
    "Choose whole grains over refined grains.",
    "Include fatty fish (like salmon) twice a week for omega-3 fatty acids.",
    "Stay hydrated with water and limit sugary beverages."
  ],
  "nutrition_goals": {
    "calories": 2000,
    "protein_g": 56,
    "fiber_g": 30,
    "sodium_mg": 2300,
    "sugar_g": 25
  }
}
```

## Model Training

The machine learning models are automatically trained when the application starts if they don't already exist. The trained models are saved in the `app/models` directory.

To manually retrain the models, you can run:
```bash
python -c "from app.services.model_trainer import train_and_save_model; train_and_save_model()"
```

## Data

The sample data used for training is located in `app/data/sample_nutrition_data.csv`. For production use, you should replace this with your actual dataset.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
