"use client";

import { useState } from "react";
import {
  AlertTriangle,
  DollarSign,
  Package,
  Truck,
  Search,
} from "lucide-react";

export default function InvoiceFlagging() {
  const [invoiceQuantity, setInvoiceQuantity] = useState(1000);
  const [totalDollars, setTotalDollars] = useState(500);
  const [freightCost, setFreightCost] = useState(600);
  const [totalItemDollars, setTotalItemDollars] = useState(9500);
  const[isAnalyzing, setIsAnalyzing] = useState(false);
  const [flagged, setFlagged] = useState(true);

const handleAnalyze = async () => {
  setIsAnalyzing(true);

  try {
    const res = await fetch(
      "https://smart-invoice-pfkt.onrender.com/predict-flag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice_quantity: invoiceQuantity,
          invoice_dollars: totalDollars,
          Freight: freightCost,
          total_item_quantity: invoiceQuantity,
          total_item_dollars: totalItemDollars,
        }),
      }
    );

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      throw new Error(data?.detail || "API error");
    }

    setFlagged(data.risk === "Suspicious");

  } catch (error) {
    console.log("API Error:", error);
    alert("Analysis failed");
  }

  setIsAnalyzing(false);
};

  return (
    <section className="min-h-screen bg-black text-white p-8">
      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT CARD */}
        <div className="bg-[#0a0f1a] border border-gray-800 rounded-3xl p-8">

          <div className="space-y-6">

            {/* Invoice Quantity */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2">
                <Package size={18} />
                Invoice Quantity
              </label>

              <input
                type="number"
                value={invoiceQuantity}
                onChange={(e) =>
                  setInvoiceQuantity(Number(e.target.value))
                }
                className="input input-bordered w-full bg-[#0d1320]"
              />
            </div>

            {/* Total Dollars */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2">
                <DollarSign size={18} />
                Total Dollars
              </label>

              <input
                type="number"
                value={totalDollars}
                onChange={(e) =>
                  setTotalDollars(Number(e.target.value))
                }
                className="input input-bordered w-full bg-[#0d1320]"
              />
            </div>

            {/* Freight Cost */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2">
                <Truck size={18} />
                Freight Cost
              </label>

              <input
                type="number"
                value={freightCost}
                onChange={(e) =>
                  setFreightCost(Number(e.target.value))
                }
                className="input input-bordered w-full bg-[#0d1320]"
              />
            </div>

            {/* Total Item Dollars */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2">
                <DollarSign size={18} />
                Total Item Dollars
              </label>

              <input
                type="number"
                value={totalItemDollars}
                onChange={(e) =>
                  setTotalItemDollars(Number(e.target.value))
                }
                className="input input-bordered w-full bg-[#0d1320]"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleAnalyze}
              className="btn w-full bg-blue-500 hover:bg-blue-600 border-none text-white rounded-xl"
            >
              <Search size={18} />
              Analyze Invoice
            </button>

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-[#0a0f1a] border border-gray-800 rounded-3xl p-8 h-fit">

          {isAnalyzing?(
            <div className="flex items-center gap-4">

              <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <p className="text-gray-400 text-lg">
                    Analyzing invoice...    
                </p>
            </div>
          ): flagged ? (
            <div>
              <div className="flex items-start gap-4">

                <AlertTriangle
                  size={42}
                  className="text-red-500 mt-1"
                />

                <div>
                  <h2 className="text-5xl font-bold text-white">
                    SUSPICIOUS
                  </h2>

                  <p className="text-2xl text-gray-300 mt-2">
                    95% confidence
                  </p>
                </div>
              </div>

              <p className="text-2xl mt-8 text-gray-300">
                Suspicious invoice pattern detected
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-5xl font-bold text-green-500">
                SAFE
              </h2>

              <p className="text-2xl mt-2 text-gray-300">
                98% confidence
              </p>

              <p className="text-2xl mt-8 text-gray-300">
                No suspicious activity detected
              </p>
            </div>
          )} 

        </div>

      </div>
    </section>
  );
}
