import os
import json
import random
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List, Optional
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score, 
    classification_report, 
    confusion_matrix,
    precision_recall_fscore_support,
    roc_auc_score,
    roc_curve,
    auc
)
from sklearn.utils.class_weight import compute_class_weight
from imblearn.over_sampling import SMOTE
from faker import Faker
import joblib
import logging
from imblearn.pipeline import Pipeline as ImbPipeline

class NutritionStrokeModel:
    def __init__(self):
        self.stroke_model = None
        self.nutrition_scaler = None
        self.encoders = {}
        self.feature_columns = [
            'age', 'gender', 'bmi', 'hypertension', 'heart_disease',
            'avg_glucose_level', 'smoking_status', 'residence_type', 'work_type'
        ]
        self.nutrition_columns = [
            'calories', 'protein_g', 'fat_g', 'carbs_g', 'fiber_g',
            'sugar_g', 'sodium_mg', 'potassium_mg', 'cholesterol_mg',
            'vitamin_a_iu', 'vitamin_c_mg', 'calcium_mg', 'iron_mg'
        ]
        
    def load_data(self, data_path: str) -> pd.DataFrame:
        """Load and preprocess the dataset."""
        df = pd.read_csv(data_path)
        
        # Ensure all categorical columns are strings
        categorical_cols = ['gender', 'smoking_status', 'residence_type', 'work_type']
        for col in categorical_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.strip()
        
        # Convert numeric columns
        numeric_cols = ['age', 'bmi', 'avg_glucose_level', 'hypertension', 'heart_disease']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Fill missing values
        for col in df.columns:
            if col in categorical_cols:
                df[col] = df[col].fillna('unknown')
            elif col in numeric_cols:
                df[col] = df[col].fillna(df[col].median())
        
        return df
    
    def encode_categorical(self, df: pd.DataFrame) -> pd.DataFrame:
        """Encode categorical variables in the dataframe."""
        df = df.copy()
        categorical_cols = ['gender', 'smoking_status', 'residence_type', 'work_type']
        
        for col in categorical_cols:
            if col in df.columns:
                # Convert to string and clean
                df[col] = df[col].astype(str).str.strip()
                
                # Initialize encoder if not exists
                if col not in self.encoders:
                    self.encoders[col] = LabelEncoder()
                    self.encoders[col].fit(df[col].unique())
                
                # Encode the column
                try:
                    df[col] = self.encoders[col].transform(df[col])
                except ValueError:
                    # If new categories are found, refit the encoder
                    unique_values = set(self.encoders[col].classes_).union(set(df[col].unique()))
                    self.encoders[col] = LabelEncoder().fit(list(unique_values))
                    df[col] = self.encoders[col].transform(df[col])
        
        return df

    def generate_synthetic_data(self, base_df: pd.DataFrame, num_samples: int = 1000) -> pd.DataFrame:
        """Generate synthetic data to enhance the training set."""
        if len(base_df) == 0:
            return base_df
            
        df = base_df.copy()
        
        # Ensure we have the right data types
        categorical_cols = ['gender', 'smoking_status', 'residence_type', 'work_type']
        numeric_cols = ['age', 'bmi', 'avg_glucose_level', 'hypertension', 'heart_disease']
        
        # Get unique values for categorical columns
        categorical_options = {}
        for col in categorical_cols:
            if col in df.columns:
                categorical_options[col] = df[col].astype(str).unique().tolist()
        
        # Generate new samples
        new_data = []
        for _ in range(num_samples):
            # Generate realistic data
            sample = {}
            
            # Generate categorical features
            for col, options in categorical_options.items():
                if options:
                    sample[col] = random.choice(options)
            
            # Generate numerical features based on statistics from real data
            sample['age'] = max(18, min(100, int(random.gauss(df['age'].mean(), df['age'].std()))))
            sample['bmi'] = max(15, min(50, random.gauss(df['bmi'].mean(), df['bmi'].std())))
            sample['avg_glucose_level'] = max(50, min(300, random.gauss(df['avg_glucose_level'].mean(), df['avg_glucose_level'].std())))
            sample['hypertension'] = random.choices([0, 1], weights=[0.9, 0.1])[0]
            sample['heart_disease'] = random.choices([0, 1], weights=[0.95, 0.05])[0]
            
            # Generate stroke based on risk factors
            stroke_risk = 0.01
            stroke_risk += 0.02 if sample['age'] > 60 else 0
            stroke_risk += 0.01 if sample['bmi'] > 30 else 0
            stroke_risk += 0.02 if sample['hypertension'] else 0
            stroke_risk += 0.02 if sample['heart_disease'] else 0
            if 'smoking_status' in sample and 'smokes' in sample['smoking_status'].lower():
                stroke_risk += 0.01
            
            sample['stroke'] = 1 if random.random() < min(0.9, stroke_risk) else 0
            
            new_data.append(sample)
        
        # Create new DataFrame
        new_df = pd.DataFrame(new_data)
        
        # Encode categorical variables
        new_df = self.encode_categorical(new_df)
        
        # Ensure all numeric columns are float
        for col in numeric_cols:
            if col in new_df.columns:
                new_df[col] = pd.to_numeric(new_df[col], errors='coerce')
        
        # Combine with original data
        combined_df = pd.concat([df, new_df], ignore_index=True)
        
        # Fill any remaining NaN values
        combined_df = combined_df.fillna(0)
        
        return combined_df
    
    def train_stroke_model(self, X: pd.DataFrame, y: pd.Series, test_size: float = 0.2) -> Dict[str, Any]:
        """Train the stroke prediction model with improved pipeline for imbalanced data."""
        print("\nTraining stroke prediction model with enhanced class weighting...")
        
        # Split data with stratification to maintain class distribution
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=test_size, 
            random_state=42, 
            stratify=y
        )
        
        # Calculate class weights for the Random Forest
        class_weights = compute_class_weight(
            class_weight='balanced',
            classes=np.unique(y_train),
            y=y_train
        )
        class_weight_dict = {i: w for i, w in enumerate(class_weights)}
        
        # Define model with class weights and balanced class settings
        model = RandomForestClassifier(
            n_estimators=200,  # Increased number of trees
            max_depth=8,       # Slightly shallower trees to prevent overfitting
            min_samples_split=10,  # Require more samples to split
            min_samples_leaf=5,    # Require more samples in leaves
            class_weight=class_weight_dict,
            max_features='sqrt',   # Consider fewer features at each split
            bootstrap=True,
            oob_score=True,       # Use out-of-bag samples for validation
            random_state=42,
            n_jobs=-1             # Use all available cores
        )
        
        # Define SMOTE for oversampling the minority class
        smote = SMOTE(
            sampling_strategy='minority',  # Focus on the minority class
            random_state=42,
            k_neighbors=min(5, sum(y_train == 1) - 1)  # Adjust based on minority class size
        )
        
        # Apply SMOTE to training data
        try:
            print("Applying SMOTE for class balancing...")
            X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
            print(f"Training data resampled - Original: {X_train.shape[0]} samples, After SMOTE: {X_train_resampled.shape[0]} samples")
        except ValueError as e:
            print(f"Could not apply SMOTE: {e}. Using original data.")
            X_train_resampled, y_train_resampled = X_train, y_train
        
        # Train model with cross-validation
        print("Training model with cross-validation...")
        cv_scores = cross_val_score(
            model, 
            X_train_resampled, 
            y_train_resampled, 
            cv=5, 
            scoring='f1',
            n_jobs=-1
        )
        
        # Final training on full training set
        print("Training final model on full dataset...")
        model.fit(X_train_resampled, y_train_resampled)
        
        # Make predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]  # Get probabilities for ROC
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(
            y_test, y_pred, average='binary', zero_division=0
        )
        
        # Calculate ROC AUC
        try:
            roc_auc = roc_auc_score(y_test, y_pred_proba)
        except ValueError:
            roc_auc = 0.5  # Default value if only one class present
        
        # Get feature importances
        feature_importance = dict(zip(X.columns, model.feature_importances_))
        
        # Store the trained model
        self.stroke_model = model
        
        # Print detailed metrics
        print("\n=== Model Performance ===")
        print(f"Cross-validated F1 Score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        print(f"Test Accuracy: {accuracy:.4f}")
        print(f"Test Precision: {precision:.4f}")
        print(f"Test Recall: {recall:.4f}")
        print(f"Test F1 Score: {f1:.4f}")
        print(f"ROC AUC: {roc_auc:.4f}")
        
        # Print classification report
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=['No Stroke', 'Stroke']))
        
        # Print feature importance
        print("\nTop 5 Important Features:")
        for feature, importance in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"- {feature}: {importance:.4f}")
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'roc_auc': roc_auc,
            'cv_f1_scores': cv_scores.tolist(),
            'feature_importance': feature_importance,
            'class_distribution': {
                'train': dict(zip(*np.unique(y_train, return_counts=True))),
                'test': dict(zip(*np.unique(y_test, return_counts=True)))
            }
        }
    
    def train_nutrition_scaler(self, df: pd.DataFrame) -> None:
        """Train the nutrition data scaler."""
        self.nutrition_scaler = StandardScaler()
        nutrition_data = df[self.nutrition_columns].copy()
        self.nutrition_scaler.fit(nutrition_data)
    
    def prepare_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """Prepare features and target for training."""
        # Select features and handle missing values
        features = df[self.feature_columns].copy()
        for col in features.columns:
            if features[col].dtype == 'object':
                features[col] = features[col].fillna(features[col].mode()[0])
            else:
                features[col] = features[col].fillna(features[col].median())
        
        target = df['stroke']
        return features, target
    
    def train(self, data_path: str, use_synthetic_data: bool = True) -> Dict[str, Any]:
        """
        Train both stroke and nutrition models with enhanced pipeline.
        
        Args:
            data_path: Path to the training data CSV file
            use_synthetic_data: Whether to generate additional synthetic data
            
        Returns:
            Dictionary containing training metrics and model information
        """
        print("Loading and preprocessing data...")
        
        try:
            # Load and preprocess data
            df = self.load_data(data_path)
            
            # Encode categorical variables
            df = self.encode_categorical(df)
            
            # Generate synthetic data if enabled
            if use_synthetic_data and len(df) > 0:
                print("Generating synthetic data to enhance training set...")
                df = self.generate_synthetic_data(df)
            
            # Prepare features and target
            X, y = self.prepare_features(df)
            
            # Ensure all data is numeric
            for col in X.columns:
                X[col] = pd.to_numeric(X[col], errors='coerce')
            X = X.fillna(0)
            
            # Ensure target is numeric
            y = y.astype(int)
            
            # Train and evaluate stroke model
            print("\nTraining stroke prediction model...")
            metrics = self.train_stroke_model(X, y)
            
            # Train nutrition data scaler
            print("\nTraining nutrition data scaler...")
            self.train_nutrition_scaler(df)
            
            # Save models and encoders
            print("\nSaving models and encoders...")
            self.save_models()
            
            return metrics
            
        except Exception as e:
            print(f"\nError during model training: {str(e)}")
            import traceback
            traceback.print_exc()
            raise
    
    def predict_stroke_risk(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict stroke risk for a given patient."""
        # Prepare input data
        input_df = pd.DataFrame([patient_data])
        
        # Encode categorical variables
        for col, encoder in self.encoders.items():
            if col in input_df.columns:
                input_df[col] = encoder.transform(input_df[col].astype(str))
        
        # Make prediction
        features = input_df[self.feature_columns]
        stroke_prob = self.stroke_model.predict_proba(features)[0][1]
        
        return {
            'stroke_risk': float(stroke_prob),
            'risk_category': self._get_risk_category(stroke_prob)
        }
    
    def get_nutrition_recommendations(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate nutrition recommendations based on patient data."""
        # This is a simplified example - in a real application, this would use
        # a more sophisticated recommendation system
        bmi = patient_data.get('bmi', 25)
        stroke_risk = patient_data.get('stroke_risk', 0.5)
        
        recommendations = []
        
        # BMI-based recommendations
        if bmi >= 30:
            recommendations.append("Reduce daily caloric intake by 500-1000 kcal for weight loss.")
            recommendations.append("Focus on whole, unprocessed foods.")
        
        # Stroke risk-based recommendations
        if stroke_risk > 0.7:
            recommendations.append("Follow a DASH (Dietary Approaches to Stop Hypertension) diet.")
            recommendations.append("Limit sodium intake to less than 1,500 mg per day.")
            recommendations.append("Increase potassium-rich foods like bananas, spinach, and sweet potatoes.")
        
        # General recommendations
        recommendations.extend([
            "Consume at least 5 servings of fruits and vegetables daily.",
            "Choose whole grains over refined grains.",
            "Include fatty fish (like salmon) twice a week for omega-3 fatty acids.",
            "Stay hydrated with water and limit sugary beverages."
        ])
        
        return {
            'recommendations': recommendations,
            'daily_goals': self._get_daily_nutrition_goals(patient_data)
        }
    
    def _get_risk_category(self, probability: float) -> str:
        """Convert probability to risk category."""
        if probability < 0.2:
            return 'Low'
        elif probability < 0.5:
            return 'Moderate'
        else:
            return 'High'
    
    def _get_daily_nutrition_goals(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate personalized daily nutrition goals."""
        # This is a simplified example
        age = patient_data.get('age', 50)
        gender = patient_data.get('gender', 'male')
        
        goals = {
            'calories': 2000 if gender == 'male' else 1800,
            'protein_g': 56 if gender == 'male' else 46,
            'fiber_g': 30,
            'sodium_mg': 1500 if patient_data.get('hypertension', 0) else 2300,
            'sugar_g': 25
        }
        
        # Adjust for age
        if age > 50:
            goals['calories'] = max(1600, goals['calories'] - 200)
            goals['calcium_mg'] = 1200
            goals['vitamin_d_iu'] = 800
        
        return goals
    
    def save_models(self, model_dir: str = 'models') -> None:
        """Save trained models and encoders."""
        os.makedirs(model_dir, exist_ok=True)
        
        joblib.dump(self.stroke_model, os.path.join(model_dir, 'stroke_model.joblib'))
        joblib.dump(self.nutrition_scaler, os.path.join(model_dir, 'nutrition_scaler.joblib'))
        joblib.dump(self.encoders, os.path.join(model_dir, 'encoders.joblib'))
    
    @classmethod
    def load_models(cls, model_dir: str = 'models') -> 'NutritionStrokeModel':
        """Load trained models and encoders."""
        instance = cls()
        
        instance.stroke_model = joblib.load(os.path.join(model_dir, 'stroke_model.joblib'))
        instance.nutrition_scaler = joblib.load(os.path.join(model_dir, 'nutrition_scaler.joblib'))
        instance.encoders = joblib.load(os.path.join(model_dir, 'encoders.joblib'))
        
        return instance

def train_and_save_model(use_synthetic_data: bool = True) -> Dict[str, Any]:
    """
    Train and save the model pipeline with enhanced functionality.
    
    Args:
        use_synthetic_data: Whether to generate additional synthetic data
        
    Returns:
        Dictionary containing training metrics and model information
    """
    try:
        # Initialize the model
        model = NutritionStrokeModel()
        
        # Get the directory of the current file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        data_path = os.path.join(current_dir, '..', 'data', 'sample_nutrition_data.csv')
        
        # Train the model with progress tracking
        print("=" * 80)
        print("Starting model training pipeline...")
        print("=" * 80)
        
        metrics = model.train(data_path, use_synthetic_data=use_synthetic_data)
        
        # Save the trained model
        models_dir = os.path.join(current_dir, '..', 'models')
        os.makedirs(models_dir, exist_ok=True)
        model.save_models(models_dir)
        
        print("\n" + "=" * 80)
        print("Model training complete!")
        print(f"- Models saved to: {models_dir}")
        print(f"- Test Accuracy: {metrics['accuracy']:.4f}")
        print("=" * 80)
        
        return metrics
        
    except Exception as e:
        print(f"\nError during model training: {str(e)}")
        raise

if __name__ == "__main__":
    train_and_save_model()
