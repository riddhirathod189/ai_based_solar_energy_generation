from pydantic import BaseModel, Field
from typing import List, Optional

class LocationData(BaseModel):
    """Defines the input data for a prediction request."""
    latitude: float = Field(..., example=23.0225, description="Latitude of the location")
    longitude: float = Field(..., example=72.5714, description="Longitude of the location")
    tilt_angle: float = Field(..., example=23, description="Tilt angle of the solar panels")
    azimuth_angle: float = Field(..., example=180, description="Azimuth angle of the panels (180=South)")
    # Adding timezone as an optional field to make the API even more robust
    timezone: Optional[str] = Field(None, example="Asia/Kolkata", description="Optional timezone (e.g., 'America/Phoenix')")

class PredictionResponse(BaseModel):
    """Defines the response for an instantaneous prediction."""
    predicted_power_watts: float = Field(..., example=350.75)

class HourlyPrediction(BaseModel):
    """Represents a single hour's forecast."""
    hour: str = Field(..., example="2025-09-14T13:00:00+05:30")
    predicted_power_watts: float = Field(..., example=410.5)

class ForecastResponse(BaseModel):
    """Defines the response for a full daily forecast."""
    hourly_forecast: List[HourlyPrediction]
    total_kwh_predicted: float = Field(..., example=4.5)
