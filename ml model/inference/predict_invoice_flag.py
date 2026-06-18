import pandas as pd
import joblib
from pathlib import Path

from invoice_flagging.preprocessing import explain_flag, feature_engineering

BASE_PATH = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_PATH / "models/invoice_model.pkl"
SCALER_PATH = BASE_PATH / "models/invoice_scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FEATURES = [
    "invoice_quantity",
    "invoice_price",
    "Freight",
    "total_quantity",
    "total_freight",
    "price_per_unit",
    "freight_ratio",
    "quantity_ratio",
    "delay_ratio"
]

def predict_invoice_flag(input_data):
    input_df = pd.DataFrame(input_data)

    # ensure base columns exist
    for col in [
        "invoice_quantity", "invoice_price", "Freight",
        "total_quantity", "total_freight", "avg_time", "days_po_to_invoice"
    ]:
        if col not in input_df.columns:
            input_df[col] = 0

    # 🔥 FEATURE ENGINEERING
    input_df = feature_engineering(input_df)

    X = input_df[FEATURES]

    # SCALE
    scaled = scaler.transform(X)

    # PREDICT
    preds = model.predict(scaled)
    probs = model.predict_proba(scaled)

    input_df["predicted_flag"] = preds

    # 🔥 CORRECT CONFIDENCE
    input_df["confidence"] = [
        round(p[int(pred)] * 100, 2)
        for p, pred in zip(probs, preds)
    ]

    # 🔥 LABEL
    input_df["risk_label"] = input_df["predicted_flag"].map({
        0: "Safe",
        1: "High Risk"
    })

    # 🔥 EXPLANATION
    input_df["reason"] = input_df.apply(explain_flag, axis=1)

    return input_df