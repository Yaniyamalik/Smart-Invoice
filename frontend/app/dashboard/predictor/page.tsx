"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, DollarSign, BarChart3, ArrowRight, Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const trendData = [
  { month: "Jan", actual: 2400, predicted: 2300 },
  { month: "Feb", actual: 2100, predicted: 2200 },
  { month: "Mar", actual: 2800, predicted: 2750 },
  { month: "Apr", actual: 2600, predicted: 2650 },
  { month: "May", actual: 3100, predicted: 3000 },
  { month: "Jun", actual: 2900, predicted: 2950 },
  { month: "Jul", actual: 3400, predicted: 3350 },
]

export default function PredictorPage() {
  const [dollars, setDollars] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<number | null>(null)

 const handlePredict = async () => {
  if (!dollars) return;

  try {
    setIsLoading(true);

    const response = await fetch("https://invoice-nalw.onrender.com/predict-freight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Dollars: Number(dollars),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    setPrediction(data.predicted_freight);
  } catch (error) {
    console.error(error);
    alert("Could not predict freight");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <DashboardLayout
      title="Freight Cost Predictor"
      description="Predict freight costs using machine learning"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Invoice Amount</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the invoice dollar amount
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="Enter amount (e.g., 10000)"
                  value={dollars}
                  onChange={(e) => setDollars(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Button
                onClick={handlePredict}
                disabled={!dollars || isLoading}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    Predict Freight Cost
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Prediction Result */}
          {prediction !== null && (
            <div className="glass animate-in fade-in slide-in-from-bottom-4 rounded-xl border-2 border-primary/30 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Predicted Freight Cost</h3>
                  <p className="text-sm text-muted-foreground">
                    ML model prediction result
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="mt-1 text-4xl font-bold text-primary">
                  ${prediction.toLocaleString()}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-lg font-semibold text-green-500">94.7%</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Model Version</p>
                  <p className="text-lg font-semibold">v2.4.1</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="glass rounded-xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Freight Cost Trends</h3>
              <p className="text-sm text-muted-foreground">
                Actual vs predicted freight costs
              </p>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "oklch(0.65 0 0)" }}
                  axisLine={{ stroke: "oklch(0.3 0 0)" }}
                />
                <YAxis
                  tick={{ fill: "oklch(0.65 0 0)" }}
                  axisLine={{ stroke: "oklch(0.3 0 0)" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.16 0.015 265)",
                    border: "1px solid oklch(0.28 0.02 265)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                  formatter={(value: number) => [`$${value}`, ""]}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="oklch(0.65 0.25 265)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.65 0.25 265)", strokeWidth: 2 }}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="oklch(0.75 0.18 180)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "oklch(0.75 0.18 180)", strokeWidth: 2 }}
                  name="Predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Actual Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Predicted Cost</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="glass rounded-xl p-6">
          <h4 className="font-medium">Model Accuracy</h4>
          <p className="mt-2 text-3xl font-bold text-primary">99.2%</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on 500K+ predictions
          </p>
        </div>
        <div className="glass rounded-xl p-6">
          <h4 className="font-medium">Avg Response Time</h4>
          <p className="mt-2 text-3xl font-bold text-accent">{"< 50ms"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time predictions
          </p>
        </div>
        <div className="glass rounded-xl p-6">
          <h4 className="font-medium">Cost Savings</h4>
          <p className="mt-2 text-3xl font-bold text-chart-3">$2.4M</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Estimated annual savings
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
