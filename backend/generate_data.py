import pandas as pd
import numpy as np
import pvlib
from tqdm import tqdm

def generate_solar_data(year, city, state, latitude, longitude, timezone):
    """
    Generates a realistic, year-long, hourly solar power generation dataset for a specific location.
    
    (Docstring remains the same)
    """
    # --- 1. Define Constants & Location ---
    TILT_ANGLE = latitude
    AZIMUTH_ANGLE = 180
    PANEL_WATTAGE_STC = 450
    PANEL_AREA_SQ_M = 2.1
    SYSTEM_LOSSES_FACTOR = 0.85

    # --- 2. Create Time Index ---
    # FIXED: Changed '1H' to 'h' to resolve the FutureWarning
    times = pd.date_range(
        start=f'{year}-01-01', 
        end=f'{year+1}-01-01', 
        freq='h', 
        tz=timezone
    )[:-1]

    df = pd.DataFrame(index=times)

    # --- 3. Model Sun Position ---
    solar_position = pvlib.solarposition.get_solarposition(times, latitude, longitude)

    # --- 4. Model Weather ---
    location = pvlib.location.Location(latitude, longitude, tz=timezone)
    clearsky = location.get_clearsky(times)
    
    # Cloud Cover Simulation
    np.random.seed(hash(city) % (2**32 - 1))
    random_noise = np.random.rand(len(times))
    
    # This ensures cloud_cover and solar_position indexes match perfectly.
    cloud_cover_raw = pd.Series(random_noise, index=times).rolling(window=12, center=True, min_periods=1).mean()
    
    seasonal_cloud_factor = np.sin(2 * np.pi * (df.index.dayofyear - 150) / 365) * 0.2 + 0.4
    cloud_cover = np.clip(cloud_cover_raw * seasonal_cloud_factor * 150, 5, 95)
    cloud_cover[solar_position['apparent_elevation'] < 0] = 10
    
    GHI = clearsky['ghi'] * (1 - cloud_cover / 110)
    GHI[GHI < 0] = 0

    # Temperature Simulation
    base_temp = 30 - (latitude - 15) * 0.5 
    temp_daily_variation = -np.cos(2 * np.pi * df.index.hour / 24) * 5
    temp_seasonal_variation = -np.cos(2 * np.pi * df.index.dayofyear / 365) * 8
    temperature = base_temp + temp_seasonal_variation + temp_daily_variation + np.random.randn(len(times)) * 1.5

    wind_speed = np.abs(pd.Series(np.random.randn(len(times)), index=times).rolling(window=6).mean() * 3 + 2)
    
    # --- 5. Calculate Power Output ---
    poa_irradiance = pvlib.irradiance.get_total_irradiance(
        surface_tilt=TILT_ANGLE,
        surface_azimuth=AZIMUTH_ANGLE,
        solar_zenith=solar_position['apparent_zenith'],
        solar_azimuth=solar_position['azimuth'],
        dni=clearsky['dni'] * (1 - cloud_cover / 110),
        ghi=GHI,
        dhi=clearsky['dhi'] * (1 - cloud_cover / 110),
        model='isotropic'
    )
    
    panel_temp = pvlib.temperature.pvsyst_cell(
        poa_global=poa_irradiance['poa_global'],
        temp_air=temperature,
        wind_speed=wind_speed
    )
    
    dc_power = pvlib.pvsystem.pvwatts_dc(
        g_poa_effective=poa_irradiance['poa_global'],
        temp_cell=panel_temp,
        pdc0=PANEL_WATTAGE_STC,
        gamma_pdc=-0.0035,
        temp_ref=25.0
    )

    ac_power = dc_power * SYSTEM_LOSSES_FACTOR
    ac_power.fillna(0, inplace=True)
    ac_power[ac_power < 0] = 0
    ac_power[solar_position['apparent_elevation'] < 0] = 0

    # --- 6. Assemble the DataFrame ---
    final_df = pd.DataFrame({
        'City': city,
        'State': state,
        'Timestamp': df.index,
        'Hour_of_Day': df.index.hour,
        'Day_of_Year': df.index.dayofyear,
        'Latitude': latitude,
        'Longitude': longitude,
        'Tilt_Angle': TILT_ANGLE,
        'Azimuth_Angle': AZIMUTH_ANGLE,
        'Panel_Wattage_STC': PANEL_WATTAGE_STC,
        'Panel_Area_sq_m': PANEL_AREA_SQ_M,
        'System_Losses_Factor': SYSTEM_LOSSES_FACTOR,
        'GHI_W_per_sq_m': GHI,
        'Temperature_C': temperature,
        'Cloud_Cover_Percent': cloud_cover,
        'Wind_Speed_mps': wind_speed,
        'Effective_Irradiance': poa_irradiance['poa_global'],
        'Power_Output_W': ac_power
    }).round(2)
    
    return final_df

# --- Main Execution Block ---
if __name__ == '__main__':
    
    # Define a list of representative cities across India
    locations = [
        {'city': 'Delhi', 'state': 'Delhi', 'latitude': 28.7041, 'longitude': 77.1025, 'timezone': 'Asia/Kolkata'},
        {'city': 'Mumbai', 'state': 'Maharashtra', 'latitude': 19.0760, 'longitude': 72.8777, 'timezone': 'Asia/Kolkata'},
        {'city': 'Bangalore', 'state': 'Karnataka', 'latitude': 12.9716, 'longitude': 77.5946, 'timezone': 'Asia/Kolkata'},
        {'city': 'Kolkata', 'state': 'West Bengal', 'latitude': 22.5726, 'longitude': 88.3639, 'timezone': 'Asia/Kolkata'},
        {'city': 'Jaipur', 'state': 'Rajasthan', 'latitude': 26.9124, 'longitude': 75.7873, 'timezone': 'Asia/Kolkata'},
        {'city': 'Chennai', 'state': 'Tamil Nadu', 'latitude': 13.0827, 'longitude': 80.2707, 'timezone': 'Asia/Kolkata'},
        {'city': 'Bhopal', 'state': 'Madhya Pradesh', 'latitude': 23.2599, 'longitude': 77.4126, 'timezone': 'Asia/Kolkata'},
    ]
    
    all_dataframes = []
    
    print("Generating solar data for multiple cities across India...")
    
    # Loop through each location and generate its data
    for location in tqdm(locations, desc="Processing Cities"):
        df = generate_solar_data(
            year=2024,
            city=location['city'],
            state=location['state'],
            latitude=location['latitude'],
            longitude=location['longitude'],
            timezone=location['timezone']
        )
        all_dataframes.append(df)
        
    # Combine all dataframes into a single large one
    print("\nCombining all datasets...")
    final_india_dataset = pd.concat(all_dataframes, ignore_index=True)
    
    # Save the final dataset to a CSV file
    output_filename = 'synthetic_solar_data_india_multi_state_2024.csv'
    final_india_dataset.to_csv(output_filename, index=False)
    
    print(f"\nDataset generation complete! Saved to '{output_filename}'")
    
    # Display information about the final dataset
    print("\n--- Final Dataset Info ---")
    print(f"Total rows: {len(final_india_dataset)}")
    print(f"Cities included: {final_india_dataset['City'].unique().tolist()}")
    
    print("\n--- Dataset Head (First 5 rows) ---")
    print(final_india_dataset.head())
    
    print("\n--- Dataset Tail (Last 5 rows) ---")
    print(final_india_dataset.tail())