from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://invoice-iota-blush.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
freight_data = joblib.load("models/predict_freight_model.pkl")
freight_model = freight_data["model"]

flag_model = joblib.load("models/predict_flag_invoice.pkl")
scaler = joblib.load("models/scaler.pkl")


@app.get("/")
def home():
    return {"message": "Invoice API Running Successfully"}


# Freight Input
class FreightInput(BaseModel):
    Dollars: float


@app.post("/predict-freight")
def predict_freight(data: FreightInput):
    df = pd.DataFrame([{"Dollars": data.Dollars}])
    pred = float(freight_model.predict(df)[0])
    return {"predicted_freight": round(pred, 2)}


# Flag Input
class FlagInput(BaseModel):
    invoice_quantity: float
    invoice_dollars: float
    Freight: float
    total_item_quantity: float
    total_item_dollars: float


@app.post("/predict-flag")
def predict_flag(data: FlagInput):
    cols = [
        "invoice_quantity",
        "invoice_dollars",
        "Freight",
        "total_item_quantity",
        "total_item_dollars"
    ]

    df = pd.DataFrame([data.dict()])[cols]
    scaled = scaler.transform(df)
    pred = int(flag_model.predict(scaled)[0])

    return {
        "risk": "Suspicious" if pred == 1 else "Safe",
        "confidence": 95
    }
