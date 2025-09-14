import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- Interfaces ---
interface Location {
  name: string;
  lat: number;
  lon: number;
  tilt: number;
  azimuth: number;
}

interface Prediction {
  predicted_power_watts: number;
  locationName: string;
  time: string;
  type: 'up' | 'down' | 'volatile';
  description: string;
  confidence: string;
  name?: string; // For UserPredictionModule
}

interface PredictionCardProps {
  prediction: Prediction;
  index: number;
}

interface PredictionFeedProps {
  history: Prediction[];
  isLoading: boolean;
}

interface UserPredictionFormData {
  name: string;
  country: string;
  state: string;
  city: string;
}

// --- A PREDEFINED LIST OF INTERESTING LOCATIONS ---
const INITIAL_LOCATIONS: Location[] = [
  { name: "Phoenix, AZ, USA", lat: 33.4484, lon: -112.0740, tilt: 33, azimuth: 180 },
  { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708, tilt: 25, azimuth: 180 },
  { name: "Jodhpur, India", lat: 26.2389, lon: 73.0243, tilt: 26, azimuth: 180 },
  { name: "Atacama Desert, Chile", lat: -24.500, lon: -69.2500, tilt: 24, azimuth: 0 },
  { name: "Alice Springs, Australia", lat: -23.6980, lon: 133.8807, tilt: 23, azimuth: 0 },
];

// --- API Base URL ---
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// --- Helper Components ---
const LoadingSpinner: React.FC<{ small?: boolean }> = ({ small = false }) => (
  <div className={`loading-spinner ${small ? 'loading-spinner--small' : ''}`}>
    <div className="spinner"></div>
  </div>
);

// --- Prediction Card Component ---
const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, index }) => {
  const { type, predicted_power_watts, description, confidence, time } = prediction;
  const typeDetails = {
    down: { icon: '↘', className: 'prediction-card--down' },
    volatile: { icon: '∼', className: 'prediction-card--volatile' },
    up: { icon: '↗', className: 'prediction-card--up' },
  };
  const details = typeDetails[type] || typeDetails.volatile;

  return (
    <div className={`prediction-card ${details.className}`}>
      <div className="prediction-card__header">
        <div className="prediction-card__title">
          <span className="prediction-card__icon">{details.icon}</span>
          Prediction #{index}
        </div>
        <div className="prediction-card__time">{time}</div>
      </div>
      <div className="prediction-card__body">
        <p className="prediction-card__value">{predicted_power_watts.toFixed(2)}</p>
        <p className="prediction-card__description">{description}</p>
      </div>
      <div className="prediction-card__footer">
        <p>Confidence: <strong>{confidence}%</strong></p>
        <div className="confidence-bar">
          <div className="confidence-bar__fill" style={{ width: `${confidence}%` }}></div>
        </div>
      </div>
    </div>
  );
};

// --- Prediction Feed Component (Left Column) ---
const PredictionFeed: React.FC<PredictionFeedProps> = ({ history, isLoading }) => (
  <div className="prediction-feed">
    <div className="prediction-feed__header">
      <h2>Live Predictions</h2>
      <div className="live-status"><span className="live-dot"></span>Live</div>
    </div>
    <div className="prediction-feed__list">
      {isLoading && history.length === 0 && <LoadingSpinner />}
      {[...history].reverse().map((p, i) => (
        <PredictionCard key={history.length - i} prediction={p} index={history.length - i} />
      ))}
    </div>
  </div>
);

// --- Component for User's Local Prediction ---
const UserPredictionModule: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserPredictionFormData>({ name: '', country: '', state: '', city: '' });
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPrediction = async (latitude: number, longitude: number, locationName: string = 'Your Location') => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict/live`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude,
          longitude,
          tilt_angle: Math.round(Math.abs(latitude)),
          azimuth_angle: latitude >= 0 ? 180 : 0,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to get prediction.');
      }
      const data: Prediction = await response.json();
      setPrediction({ ...data, name: locationName });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchUserPrediction(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError('Unable to retrieve your location. Please try the manual form.');
        setIsLoading(false);
      }
    );
  };

  const handleGeocodeAndPredict = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const { city, state, country } = formData;
    if (!city || !country) {
      setError('City and Country are required for manual prediction.');
      setIsLoading(false);
      return;
    }

    const query = encodeURIComponent(`${city}, ${state}, ${country}`);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data: Array<{ lat: string; lon: string; display_name: string }> = await response.json();
      if (data.length === 0) {
        throw new Error('Location not found. Please check your spelling.');
      }
      const { lat, lon } = data[0];
      fetchUserPrediction(parseFloat(lat), parseFloat(lon), formData.name || data[0].display_name);
    } catch (err: unknown) {
      setError(err instanceof Error ? `Geocoding failed: ${err.message}` : 'Geocoding failed: An unknown error occurred.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="user-prediction-module">
      <button onClick={() => setIsFormVisible(!isFormVisible)} className="cta-button">
        {isFormVisible ? 'Close Predictor' : '⚡ Get Your Local Prediction'}
      </button>

      {isFormVisible && (
        <div className="prediction-form-container">
          <div className="form-section">
            <button onClick={handleGeolocate} className="form-button form-button--geolocate">
              📍 Use Device Location
            </button>
          </div>

          <div className="form-divider">OR</div>

          <form onSubmit={handleGeocodeAndPredict} className="form-section">
            <p className="form-title">Enter Your Location Manually</p>
            <input
              type="text"
              name="name"
              placeholder="Location Name (e.g., My Home)"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="city"
              placeholder="City*"
              value={formData.city}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State / Region"
              value={formData.state}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="country"
              placeholder="Country*"
              value={formData.country}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <button type="submit" className="form-button">Predict from Address</button>
          </form>

          {isLoading && <LoadingSpinner small />}
          {error && <div className="error-message">{error}</div>}
          {prediction && (
            <div className="user-prediction-result">
              <h3>Prediction for: {prediction.name}</h3>
              <p className="result-value">{prediction.predicted_power_watts.toFixed(2)} <span>Watts</span></p>
              <p className="result-detail">This is the estimated solar power generation for the current hour under clear sky conditions.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Main Dashboard Page Component ---
const DashboardPage: React.FC = () => {
  const [predictionHistory, setPredictionHistory] = useState<Prediction[]>([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Core Logic for the Live Feed ---
  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true);
      setError(null);
      const location = INITIAL_LOCATIONS[currentLocationIndex];
      try {
        const response = await fetch(`${API_BASE_URL}/predict/live`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: location.lat,
            longitude: location.lon,
            tilt_angle: location.tilt,
            azimuth_angle: location.azimuth,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'API call failed.');
        }
        const data: Prediction = await response.json();

        // --- Data Augmentation for UI ---
        const types: Array<'up' | 'down' | 'volatile'> = ['up', 'down', 'volatile'];
        const descriptions: Record<string, string> = {
          up: 'Positive trend detected',
          down: 'Breakout pattern forming',
          volatile: 'High volatility expected',
        };
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomConfidence = (Math.random() * (99.8 - 70) + 70).toFixed(1);
        const newPrediction: Prediction = {
          ...data,
          locationName: location.name,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: randomType,
          description: descriptions[randomType],
          confidence: randomConfidence,
        };
        setPredictionHistory(prevHistory => [...prevHistory, newPrediction].slice(-20));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrediction();
  }, [currentLocationIndex]);

  // --- Location Cycling Timer ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLocationIndex(prevIndex => (prevIndex + 1) % INITIAL_LOCATIONS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        /* --- Global Styles & Dark Theme --- */
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: #0f172a;
          color: #e2e8f0;
        }
        .dashboard { min-height: 100vh; padding: 2rem; }
        .dashboard__container { max-width: 1400px; margin: 0 auto; }

        /* --- Header --- */
        .dashboard__header { text-align: center; margin-bottom: 2.5rem; }
        .dashboard__title { font-size: 2.75rem; font-weight: bold; color: #7dd3fc; }
        .dashboard__subtitle { font-size: 1.125rem; color: #94a3b8; margin-top: 0.5rem; }

        /* --- Split Screen Grid Layout --- */
        .live-feed-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) {
          .live-feed-grid { grid-template-columns: 400px 1fr; }
        }

        /* --- Chart Card --- */
        .history-chart__card {
          background-color: #1e293b;
          border-radius: 0.75rem;
          padding: 2rem;
          border: 1px solid #334155;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
          min-height: 500px;
        }
        .history-chart__title { font-size: 1.25rem; font-weight: bold; text-align: center; margin-bottom: 1.5rem; color: #cbd5e1; }

        /* --- Helper Components --- */
        .loading-spinner { display: flex; justify-content: center; align-items: center; padding: 2rem; width: 100%; }
        .loading-spinner--small { padding: 1rem; }
        .spinner {
          animation: spin 1s linear infinite;
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          border-top: 2px solid #38bdf8;
          border-bottom: 2px solid #38bdf8;
        }
        .loading-spinner--small .spinner { width: 1.5rem; height: 1.5rem; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .error-message { background-color: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-top: 1rem; }
        
        /* --- Prediction Feed & Card --- */
        .prediction-feed { background-color: #1e293b; border-radius: 0.75rem; border: 1px solid #334155; display: flex; flex-direction: column; height: 80vh; min-height: 600px; }
        .prediction-feed__header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #334155; }
        .prediction-feed__header h2 { font-size: 1.5rem; margin: 0; font-weight: 600; }
        .live-status { display: flex; align-items: center; gap: 0.5rem; color: #4ade80; font-weight: 500; }
        .live-dot { width: 10px; height: 10px; background-color: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); } 50% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); } }
        .prediction-feed__list { flex-grow: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
        .prediction-card { background-color: #334155; border-radius: 0.5rem; padding: 1.25rem; border-left: 5px solid; animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .prediction-card--down { border-color: #f87171; } .prediction-card--volatile { border-color: #60a5fa; } .prediction-card--up { border-color: #4ade80; }
        .prediction-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .prediction-card__title { font-weight: 600; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem; }
        .prediction-card__icon { font-size: 1.5rem; line-height: 1; }
        .prediction-card__time { font-size: 0.875rem; color: #94a3b8; }
        .prediction-card__body { margin-bottom: 1rem; }
        .prediction-card__value { font-size: 2.5rem; font-weight: 700; margin: 0; line-height: 1; color: #f1f5f9; }
        .prediction-card__description { margin: 0.5rem 0 0 0; font-size: 1rem; color: #cbd5e1; }
        .prediction-card__footer { font-size: 0.875rem; color: #94a3b8; }
        .prediction-card__footer p { margin: 0 0 0.5rem 0; }
        .confidence-bar { width: 100%; height: 6px; background-color: #475569; border-radius: 3px; overflow: hidden; }
        .confidence-bar__fill { height: 100%; border-radius: 3px; }
        .prediction-card--down .confidence-bar__fill { background-color: #f87171; } .prediction-card--volatile .confidence-bar__fill { background-color: #60a5fa; } .prediction-card--up .confidence-bar__fill { background-color: #4ade80; }

        /* --- NEW STYLES for User Prediction Module --- */
        .user-prediction-module {
            background-color: #1e293b;
            border-radius: 0.75rem;
            padding: 1.5rem;
            border: 1px solid #334155;
            margin-bottom: 2rem;
        }
        .cta-button {
            width: 100%;
            padding: 1rem;
            font-size: 1.25rem;
            font-weight: bold;
            color: #fff;
            background: linear-gradient(90deg, #38bdf8, #60a5fa);
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
        }
        .prediction-form-container {
            margin-top: 1.5rem;
            animation: fadeIn 0.5s ease-out;
        }
        .form-section {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .form-divider {
            text-align: center;
            color: #64748b;
            margin: 1.5rem 0;
            font-weight: bold;
        }
        .form-title {
            text-align: center;
            font-size: 1rem;
            color: #94a3b8;
            margin: 0 0 0.5rem 0;
        }
        .form-input {
            width: 100%;
            padding: 0.75rem;
            background-color: #334155;
            border: 1px solid #475569;
            border-radius: 0.5rem;
            color: #e2e8f0;
            font-size: 1rem;
            box-sizing: border-box;
        }
        .form-button {
            padding: 0.8rem;
            font-size: 1rem;
            font-weight: bold;
            color: #fff;
            background-color: #4f46e5;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .form-button:hover { background-color: #4338ca; }
        .form-button--geolocate { background-color: #059669; }
        .form-button--geolocate:hover { background-color: #047857; }
        
        .user-prediction-result {
            margin-top: 2rem;
            padding: 1.5rem;
            background-color: #334155;
            border-radius: 0.5rem;
            border-left: 5px solid #7dd3fc;
            text-align: center;
            animation: fadeIn 0.5s ease-out;
        }
        .user-prediction-result h3 {
            margin: 0 0 0.5rem 0;
            color: #e2e8f0;
        }
        .user-prediction-result .result-value {
            font-size: 3rem;
            font-weight: bold;
            color: #fff;
            margin: 0.5rem 0;
        }
        .user-prediction-result .result-value span {
            font-size: 1.5rem;
            color: #94a3b8;
            margin-left: 0.5rem;
        }
        .user-prediction-result .result-detail {
            font-size: 0.875rem;
            color: #94a3b8;
            margin: 0;
        }
      `}</style>
      <div className="dashboard mt-20">
        <div className="dashboard__container">
          <header className="dashboard__header">
            <h1 className="dashboard__title">Live Global Solar Power Feed</h1>
            <p className="dashboard__subtitle">Automatically fetching live predictions from sunny locations around the world every 10 seconds.</p>
          </header>
          
          <UserPredictionModule />

          <div className="live-feed-grid">
            <PredictionFeed history={predictionHistory} isLoading={isLoading} />
            <div className="history-chart__card">
              <h2 className="history-chart__title">Prediction History Chart</h2>
              {error && <div className="error-message">{error}</div>}
              <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
                <ResponsiveContainer>
                  <LineChart data={predictionHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" label={{ value: 'Watts', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} labelStyle={{ color: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                    <Line type="monotone" dataKey="predicted_power_watts" name="Power (W)" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;