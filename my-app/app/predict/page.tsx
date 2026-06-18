"use client";

import { FormEvent, useState } from "react";
import FreightChart from "./chat";

export default function Page() {
  const [invoicePrice, setInvoicePrice] = useState(0);
  const [prediction, setPrediction] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
          "https://smart-invoice-pfkt.onrender.com/predict-freight",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Dollars: invoicePrice,
            }),
          }
        );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || 'API error');
      }

      setPrediction(Number(data.predicted_freight ?? 0));
    } catch (error) {
      console.log("API Error:", error);
      alert("Prediction failed");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Freight Prediction
        </h1>

        <p className="text-gray-400 mt-4">
          Predict freight costs using invoice details and visualize
          trends with analytics.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* LEFT PANEL */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Prediction Form */}
          <div className="card bg-base-100 shadow-xl h-[500px]">
            <div className="card-body">

              <h2 className="card-title text-2xl">
                Predict Freight Cost
              </h2>

              <form
                onSubmit={handlePredict}
                className="space-y-4 mt-4"
              >

                {/* Invoice Price Input */}
                <div>
                  <label className="label">
                    <span className="label-text">
                      Invoice Amount (Dollars)
                    </span>
                  </label>

                  <input
                    type="number"
                    value={invoicePrice}
                    onChange={(e) =>
                      setInvoicePrice(Number(e.target.value))
                    }
                    className="input input-bordered w-full"
                    placeholder="Enter Invoice Amount"
                    required
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full mt-4"
                  disabled={loading}
                >
                  {loading
                    ? "Predicting..."
                    : "Predict Freight"}
                </button>

             <div className="stat-title color-gray-400 mt-6">
            Predicted Cost
          </div>

          <div className="stat-value text-primary">
            ₹{prediction.toFixed(2)}
          </div>
              </form>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-3">

          <div className="card bg-base-100 shadow-xl h-[500px]">
            <div className="card-body">

              <h2 className="card-title text-2xl">
                Freight Cost Analytics
              </h2>

              <div className="mt-4">
                <FreightChart />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Stats */}
      <div className="stats stats-horizontal lg:stats-horizontal shadow bg-base-100 w-full mt-10">

        <div className="stat">
          <div className="stat-title">
            Predicted Cost
          </div>

          <div className="stat-value text-primary">
            ₹{prediction.toFixed(2)}
          </div>

          <div className="stat-desc">
            Latest prediction
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">
            Model Accuracy
          </div>

          <div className="stat-value text-success">
            96.99%
          </div>

          <div className="stat-desc">
            Based on training data
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">
            Processed Invoices
          </div>

          <div className="stat-value">
            4.2K
          </div>

          <div className="stat-desc">
            Total records analyzed
          </div>
        </div>

      </div>

    </section>
  );
}
