# Smart Invoice Analytics Platform

An AI-powered full-stack invoice intelligence platform that helps businesses detect suspicious invoices, predict freight costs, and analyze bulk invoice datasets.

## Live Demo

* **Frontend:** [https://invoice-iota-blush.vercel.app/](https://invoice-iota-blush.vercel.app/)
* **Backend API:** [https://invoice-nalw.onrender.com/](https://invoice-nalw.onrender.com/)
* **API Docs:** [https://invoice-nalw.onrender.com/docs](https://invoice-nalw.onrender.com/docs)

---

## Features

### 1. Invoice Fraud Detection

Analyze invoice details and classify invoices as **Safe** or **Suspicious** using a trained machine learning model.

### 2. Freight Cost Prediction

Predict expected freight cost based on invoice amount.

### 3. Bulk Invoice Analysis

Upload CSV/XLSX files to analyze multiple invoices at once with summary insights.

### 4. Modern Dashboard UI

Responsive dashboard with charts, analytics cards, and clean navigation.

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts

### Backend

* FastAPI
* Python
* Pandas
* scikit-learn
* Joblib

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## Project Structure

```text
invoice/
├── frontend/        # Next.js app
├── backend/         # FastAPI APIs + ML models
 ├── models/          # Trained .pkl files
└── README.md
```

---

## API Endpoints

### Health Check

`GET /`

### Predict Freight

`POST /predict-freight`

Request:

```json
{
  "Dollars": 10000
}
```

### Predict Fraud Risk

`POST /predict-flag`

Request:

```json
{
  "invoice_quantity": 10,
  "invoice_dollars": 500,
  "Freight": 20,
  "total_item_quantity": 10,
  "total_item_dollars": 500
}
```

---

## Local Setup

### Clone Repository

```bash
git clone <your-repo-url>
cd invoice
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Resume Highlights

* Built a full-stack AI-powered invoice analytics platform.
* Integrated ML models for fraud detection and freight prediction.
* Developed REST APIs with FastAPI.
* Designed responsive UI with Next.js and Tailwind CSS.
* Deployed production-ready app using Vercel and Render.

---

## Machine Learning Details

### Freight Prediction Model

* Compared Linear Regression, Decision Tree Regressor, and Random Forest Regressor.
* **Best Model:** Linear Regression
* **Metrics:** R² 96.99%, MAE 24.11, RMSE 124.72
* Chosen for high accuracy and interpretability.

### Invoice Risk Detection Model

* Built a rule-based labeling pipeline and trained classifiers.
* Compared Logistic Regression, Decision Tree Classifier, and Random Forest Classifier.
* **Best Model:** Random Forest Classifier
* **Accuracy:** 89%
* Chosen for robustness and ability to learn non-linear patterns.

### Data Pipeline

* Sources: `vendor_invoice`, `purchases`, `purchase_prices`, `begin_inventory`, `end_inventory`
* Feature engineering included invoice values, quantities, freight variance, delays, and aggregated purchase metrics.
* Models serialized with Joblib and served through FastAPI APIs.

---

## Future Improvements

* User Authentication
* Database Integration
* Downloadable Reports (PDF/Excel)
* Role-based Access Control
* Real-time Notifications
* Advanced Model Monitoring

---

## Author

**Yaniya **
