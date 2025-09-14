from fastapi import APIRouter, Depends, HTTPException, Body
from schemas.prediction_schema import LocationData, PredictionResponse, ForecastResponse
from services.ml_services import SolarPredictionService
import os
from dotenv import load_dotenv

load_dotenv()

# This ensures the model is loaded only once when the application starts
ml_service = SolarPredictionService()
router = APIRouter()

def get_api_key():
    api_key = "28afca387834754b8492138f67ed23fe"
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenWeather API key not configured on server.")
    return api_key

@router.post("/predict/live", response_model=PredictionResponse, tags=["Prediction"])
async def predict_live(location: LocationData = Body(...), api_key: str = Depends(get_api_key)):
    """Accepts location data and returns an instantaneous solar power prediction."""
    try:
        power = ml_service.predict_now(api_key, location)
        return {"predicted_power_watts": power}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/forecast", response_model=ForecastResponse, tags=["Prediction"])
async def predict_forecast(location: LocationData = Body(...), api_key: str = Depends(get_api_key)):
    """Accepts location data and returns a 24-hour hourly forecast."""
    try:
        forecast = ml_service.predict_daily_forecast(api_key, location)
        return forecast
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

