import pandas as pd
import xgboost as xgb
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def train_solar_model():
    """
    Loads data, trains a robust XGBoost model with early stopping to prevent overfitting,
    evaluates its performance, and saves the final model.
    """
    print("--- Starting Model Training and Evaluation ---")
    
    # 1. Load the Dataset
    try:
        df = pd.read_csv('synthetic_solar_data_india_multi_state_2024.csv')
        print(f"Successfully loaded dataset with {len(df)} rows.")
    except FileNotFoundError:
        print("Error: 'synthetic_solar_data_india_multi_state_2024.csv' not found.")
        print("Please make sure the data file is in the same folder.")
        return

    # 2. Define Features (X) and Target (y)
    features = [
        'Hour_of_Day', 'Day_of_Year', 'Latitude', 'Longitude', 
        'Tilt_Angle', 'Azimuth_Angle', 'GHI_W_per_sq_m', 
        'Temperature_C', 'Cloud_Cover_Percent', 'Wind_Speed_mps'
    ]
    target = 'Power_Output_W'

    X = df[features]
    y = df[target]

    # 3. Split Data into Training and Testing Sets
    # This is crucial for evaluating the model on unseen data to check for overfitting.
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Data split into {len(X_train)} training samples and {len(X_test)} testing samples.")

    # 4. Initialize and Train the XGBoost Model
    # We use parameters that promote robustness.
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=2000,          # High number, but early stopping will find the best value
        learning_rate=0.02,         # Low learning rate to prevent overfitting
        max_depth=7,                # Controls complexity of trees
        subsample=0.8,              # Use 80% of data for each tree
        colsample_bytree=0.8,       # Use 80% of features for each tree
        random_state=42,
        n_jobs=-1,
        early_stopping_rounds=50,
    )

    print("\nTraining the model with early stopping...")
    # The 'eval_set' and 'early_stopping_rounds' are key to preventing overfitting.
    # The model will stop if the performance on the test set doesn't improve for 50 rounds.
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False # Set to True if you want to see the training progress
    )
    
    print("Model training complete.")

    # 5. Evaluate the Model on the Unseen Test Set
    print("\n--- Model Performance Evaluation ---")
    y_pred = model.predict(X_test)

    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print(f"R-squared (R²): {r2:.4f}")
    print(f"Mean Absolute Error (MAE): {mae:.2f} Watts")
    print(f"Root Mean Squared Error (RMSE): {rmse:.2f} Watts")
    
    if r2 > 0.95:
        print("\n✅ The model shows excellent performance and generalization on unseen data.")
    else:
        print("\nModel performance is okay, but could be improved with more feature engineering.")

    # 6. Visualize Feature Importance
    plt.figure(figsize=(10, 6))
    sns.barplot(x=model.feature_importances_, y=features)
    plt.title('Feature Importance')
    plt.xlabel('Importance Score')
    plt.ylabel('Features')
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    print("\nSaved feature importance plot to 'feature_importance.png'")

    # 7. Save the Final Trained Model
    model_filename = 'solar_power_model_final.joblib'
    joblib.dump(model, model_filename)
    print(f"✅ Final model saved successfully as '{model_filename}'")

if __name__ == '__main__':
    train_solar_model()


























# import pandas as pd
# import numpy as np
# import joblib
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
# from xgboost import XGBRegressor
# import os

# # --- Constants ---
# MODEL_PATH = "model.joblib"
# DATASET_PATH = "solar_energy_global.csv"
# TARGET_COLUMN = "E_gen_kWh"

# def load_data():
#     """
#     Loads and preprocesses the dataset from the CSV file.
#     """
#     print(os.path.exists(DATASET_PATH))
#     if not os.path.exists(DATASET_PATH):
#         raise FileNotFoundError(f"Dataset file not found at {DATASET_PATH}. Please ensure it's in the correct directory.")

#     print(f"Loading data from {DATASET_PATH}...")
#     df = pd.read_csv(DATASET_PATH)

#     # Convert date column to datetime objects
#     df['date'] = pd.to_datetime(df['date'])

#     # --- Feature Engineering ---
#     # Create time-based features
#     df['month'] = df['date'].dt.month
#     df['day_of_year'] = df['date'].dt.dayofyear
#     df['day_of_week'] = df['date'].dt.dayofweek
#     df['daylight_hours'] = df['daylight_hours']

#     # Cyclical features for angles
#     df['solar_zenith_sin'] = np.sin(np.radians(df['solar_zenith']))
#     df['solar_zenith_cos'] = np.cos(np.radians(df['solar_zenith']))
#     df['solar_azimuth_sin'] = np.sin(np.radians(df['solar_azimuth']))
#     df['solar_azimuth_cos'] = np.cos(np.radians(df['solar_azimuth']))

#     # Drop original date and angle columns as they are now encoded
#     features = df.drop(columns=[TARGET_COLUMN, 'date', 'region', 'solar_zenith', 'solar_azimuth', 'solar_elevation'])
#     target = df[TARGET_COLUMN]

#     return features, target

# def train_model():
#     """
#     Trains the XGBoost model on the entire dataset and saves it.
#     """
#     print("Starting model training process...")

#     # Load and preprocess data
#     try:
#         X, y = load_data()
#     except FileNotFoundError as e:
#         print(e)
#         return None, None

#     # Splitting the dataset into training and testing sets
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
#     print(f"Data split into {len(X_train)} training samples and {len(X_test)} testing samples.")

#     # Initialize the XGBoost regressor model
#     model = XGBRegressor(objective='reg:squarederror', n_estimators=1000, learning_rate=0.05, n_jobs=-1)

#     # Train the model
#     print("Training XGBoost model...")
#     model.fit(X_train, y_train)
#     print("Training complete.")

#     # Evaluate the model on the test set
#     y_pred = model.predict(X_test)
    
#     mae = mean_absolute_error(y_test, y_pred)
#     rmse = np.sqrt(mean_squared_error(y_test, y_pred))
#     r2 = r2_score(y_test, y_pred)
    
#     print("\n--- Model Performance on Test Data ---")
#     print(f"Mean Absolute Error (MAE): {mae:.4f} kWh")
#     print(f"Root Mean Squared Error (RMSE): {rmse:.4f} kWh")
#     print(f"R-squared (R²): {r2:.4f}")
    
#     # Save the trained model to a file
#     joblib.dump(model, MODEL_PATH)
#     print(f"\nModel saved to {MODEL_PATH}")

#     return model, {"mae": mae, "rmse": rmse, "r2_score": r2}

# def get_trained_model():
#     """
#     Loads the pre-trained ML model from disk. If the model file
#     does not exist, it trains the model first.
#     """
#     if os.path.exists(MODEL_PATH):
#         print(f"Loading ML model from {MODEL_PATH}...")
#         model = joblib.load(MODEL_PATH)
#         return model
#     else:
#         print("Pre-trained model not found. Training a new model now.")
#         model, metrics = train_model()
#         if model is None:
#             raise RuntimeError("Model training failed.")
#         return model

# def predict_power(model, data):
#     """
#     Makes a prediction using the loaded model and preprocessed data.
#     """
#     # The data argument is already a pandas DataFrame from the preprocessing step.
#     return model.predict(data)

# # --- Main block for testing model training separately ---
# if __name__ == "__main__":
#     # You can run this file directly to train the model and see its performance
#     trained_model, performance_metrics = train_model()
#     if trained_model:
#         print("\nModel training and evaluation complete. The trained model is ready to be used by the API.")


# --- Constants ---
# MODEL_PATH = "model.joblib"
# DATASET_PATH = "solar_energy_global.csv"
# TARGET_COLUMN = "E_gen_kWh"

# def load_data():
#     """
#     Loads and preprocesses the dataset from the CSV file.
#     """
#     if not os.path.exists(DATASET_PATH):
#         raise FileNotFoundError(f"Dataset file not found at {DATASET_PATH}. Please ensure it's in the correct directory.")

#     print(f"Loading data from {DATASET_PATH}...")
#     df = pd.read_csv(DATASET_PATH)

#     # Convert date column to datetime objects
#     df['date'] = pd.to_datetime(df['date'])

#     # --- Feature Engineering ---
#     # Create time-based features
#     df['month'] = df['date'].dt.month
#     df['day_of_year'] = df['date'].dt.dayofyear
#     df['day_of_week'] = df['date'].dt.dayofweek
#     df['daylight_hours'] = df['daylight_hours']

#     # Cyclical features for angles
#     df['solar_zenith_sin'] = np.sin(np.radians(df['solar_zenith']))
#     df['solar_zenith_cos'] = np.cos(np.radians(df['solar_zenith']))
#     df['solar_azimuth_sin'] = np.sin(np.radians(df['solar_azimuth']))
#     df['solar_azimuth_cos'] = np.cos(np.radians(df['solar_azimuth']))

#     # Drop original date and angle columns as they are now encoded
#     features = df.drop(columns=[TARGET_COLUMN, 'date', 'region', 'solar_zenith', 'solar_azimuth', 'solar_elevation'])
#     target = df[TARGET_COLUMN]

#     return features, target

# def train_model():
#     """
#     Trains the XGBoost model on the entire dataset and saves it.
#     """
#     print("Starting model training process...")

#     # Load and preprocess data
#     try:
#         X, y = load_data()
#     except FileNotFoundError as e:
#         print(e)
#         return None, None

#     # Splitting the dataset into training and testing sets
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
#     print(f"Data split into {len(X_train)} training samples and {len(X_test)} testing samples.")

#     # Initialize the XGBoost regressor model
#     model = XGBRegressor(objective='reg:squarederror', n_estimators=1000, learning_rate=0.05, n_jobs=-1)

#     # Train the model
#     print("Training XGBoost model...")
#     model.fit(X_train, y_train)
#     print("Training complete.")

#     # Evaluate the model on the test set
#     y_pred = model.predict(X_test)
    
#     mae = mean_absolute_error(y_test, y_pred)
#     rmse = np.sqrt(mean_squared_error(y_test, y_pred))
#     r2 = r2_score(y_test, y_pred)
    
#     print("\n--- Model Performance on Test Data ---")
#     print(f"Mean Absolute Error (MAE): {mae:.4f} kWh")
#     print(f"Root Mean Squared Error (RMSE): {rmse:.4f} kWh")
#     print(f"R-squared (R²): {r2:.4f}")
    
#     # Save the trained model to a file
#     joblib.dump(model, MODEL_PATH)
#     print(f"\nModel saved to {MODEL_PATH}")

#     return model, {"mae": mae, "rmse": rmse, "r2_score": r2}

# def get_trained_model():
#     """
#     Loads the pre-trained ML model from disk. If the model file
#     does not exist, it trains the model first.
#     """
#     if os.path.exists(MODEL_PATH):
#         print(f"Loading ML model from {MODEL_PATH}...")
#         model = joblib.load(MODEL_PATH)
#         return model
#     else:
#         print("Pre-trained model not found. Training a new model now.")
#         model, metrics = train_model()
#         if model is None:
#             raise RuntimeError("Model training failed.")
#         return model

# def predict_power(model, data):
#     """
#     Makes a prediction using the loaded model and preprocessed data.
#     """
#     return model.predict(data)

# # --- Main block for testing model training separately ---
# if __name__ == "__main__":
#     trained_model, performance_metrics = train_model()
#     if trained_model:
#         print("\nModel training and evaluation complete. The trained model is ready to be used by the API.")