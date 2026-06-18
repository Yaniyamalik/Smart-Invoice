from pathlib import Path
import joblib
import pandas as pd

BASE_PATH = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_PATH / "models/freight_model.pkl"
SCALER_PATH = BASE_PATH / "models/freight_scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

def preprocess(df):
    df["price_per_unit"] = df["invoice_price"] / (df["invoice_quantity"] + 1)
    df["invoice_delay"] = df.get("invoice_delay", 5)
    df["total_quantity"] = df.get("total_quantity", df["invoice_quantity"])

    features = df[
        ["invoice_price", "invoice_quantity", "price_per_unit", "invoice_delay", "total_quantity"]
    ]

    return scaler.transform(features)


def predict_freight_cost(input_data):
    df = pd.DataFrame(input_data)
    X = preprocess(df)
    df["predicted_freight"] = model.predict(X).round(2)
    return df