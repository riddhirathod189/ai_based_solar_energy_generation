import pandas as pd
import requests
import joblib
import pvlib
import pytz
import os
from schemas.prediction_schema import LocationData
import timezonefinder

class SolarPredictionService:
    def __init__(self, model_path='models/solar_power_model_final.joblib'):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Please train the model first.")
        self.model = joblib.load(model_path)
        print("ML model loaded successfully.")

    def _get_timezone_str(self, lat, lon, user_tz=None):
        if user_tz and user_tz in pytz.all_timezones:
            return user_tz
        # pvlib's timezone lookup can be sensitive, so this is a more robust way
        try:
            tf = timezonefinder.TimezoneFinder()
            return tf.timezone_at(lng=lon, lat=lat)
        except ImportError:
            # Fallback for simpler cases if timezonefinder is not installed
            return "UTC"

    def _prepare_features(self, timestamp: pd.Timestamp, weather_data: dict, location_data: LocationData):
        temperature = weather_data.get('main', {}).get('temp')
        wind_speed = weather_data.get('wind', {}).get('speed')
        cloud_cover = weather_data.get('clouds', {}).get('all')
        
        location = pvlib.location.Location(location_data.latitude, location_data.longitude)
        times = pd.DatetimeIndex([timestamp])
        solar_position = location.get_solarposition(times)

        estimated_ghi = 0
        if solar_position['apparent_elevation'].iloc[0] > 0:
            clearsky = location.get_clearsky(times)
            estimated_ghi = clearsky['ghi'].iloc[0] * (1 - (cloud_cover or 0) / 110)
        
        if estimated_ghi < 0: estimated_ghi = 0
        
        return pd.DataFrame([{'Hour_of_Day': timestamp.hour, 'Day_of_Year': timestamp.dayofyear,
            'Latitude': location_data.latitude, 'Longitude': location_data.longitude,
            'Tilt_Angle': location_data.tilt_angle, 'Azimuth_Angle': location_data.azimuth_angle,
            'GHI_W_per_sq_m': estimated_ghi, 'Temperature_C': temperature,
            'Cloud_Cover_Percent': cloud_cover, 'Wind_Speed_mps': wind_speed}])

    def predict_now(self, api_key: str, location_data: LocationData) -> float:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={location_data.latitude}&lon={location_data.longitude}&appid={api_key}&units=metric"
        response = requests.get(url)
        response.raise_for_status()
        weather_data = response.json()
        
        tz_str = self._get_timezone_str(location_data.latitude, location_data.longitude, location_data.timezone)
        now_local = pd.Timestamp.now(tz=tz_str)
        
        features = self._prepare_features(now_local, weather_data, location_data)
        predicted_power = self.model.predict(features)[0]
        return float(predicted_power) if predicted_power > 0 else 0.0

    def predict_daily_forecast(self, api_key: str, location_data: LocationData) -> dict:
        url = f"https://api.openweathermap.org/data/3.0/onecall?lat={location_data.latitude}&lon={location_data.longitude}&exclude=current,minutely,daily,alerts&appid={api_key}&units=metric"
        response = requests.get(url)
        response.raise_for_status()
        weather_data = response.json()

        hourly_predictions = []
        tz_str = self._get_timezone_str(location_data.latitude, location_data.longitude, location_data.timezone)

        for hour_data in weather_data.get('hourly', [])[:24]:
            timestamp = pd.to_datetime(hour_data['dt'], unit='s', utc=True).tz_convert(tz_str)
            hour_weather = {'main': {'temp': hour_data['temp']}, 'wind': {'speed': hour_data['wind_speed']}, 'clouds': {'all': hour_data['clouds']}}
            
            features = self._prepare_features(timestamp, hour_weather, location_data)
            predicted_power = self.model.predict(features)[0]
            if predicted_power < 0: predicted_power = 0
            
            hourly_predictions.append({"hour": str(timestamp), "predicted_power_watts": round(predicted_power, 2)})
        
        total_watt_hours = sum(p['predicted_power_watts'] for p in hourly_predictions)
        return {"hourly_forecast": hourly_predictions, "total_kwh_predicted": round(total_watt_hours / 1000, 2)}

