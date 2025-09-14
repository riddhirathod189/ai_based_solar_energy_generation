from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import prediction
from dotenv import load_dotenv
import os

# Load environment variables from a .env file
load_dotenv()

app = FastAPI(
    title="Solar Power Prediction Platform",
    description="An AI/ML-powered platform to predict solar power generation for any location.",
    version="1.0.0"
)

# --- THIS IS THE CRUCIAL PART ---
# Define the list of origins that are allowed to make requests to this API
origins = [
    "http://localhost",
    "http://localhost:5173",  # The default address for Vite React apps
    "http://localhost:3000",  # A common address for Create React App
]

# Add the CORS middleware to the FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],        # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],        # Allow all headers
)

# Include the API router from your routes file
app.include_router(prediction.router, prefix="/api/v1")

# Root endpoint for a health check
@app.get("/", tags=["Health Check"])
async def read_root():
    return {"message": "Solar Power Prediction API is running!"}
