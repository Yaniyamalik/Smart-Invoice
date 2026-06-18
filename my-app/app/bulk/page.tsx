"use client";

import { Upload, FileText, FileSpreadsheet, BarChart3 } from "lucide-react";
import { useState } from "react";

export default function BatchProcessing() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const [loading, setLoading] = useState(false);
const [result, setResult] = useState<any>(null);

const handleAnalyze = async () => {
  if (!file) {
    alert("Please upload a file first.");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(
      "https://smart-invoice-pfkt.onrender.com/batch-process",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      throw new Error(data?.detail || "Upload failed");
    }

    setResult(data);

  } catch (error) {
    console.log("Upload Error:", error);
    alert("File analysis failed");
  }

  setLoading(false);
};

  return (
    <section className="min-h-screen bg-black text-white px-6 py-12">

      {/* Upload Area */}
      <div className="max-w-5xl mx-auto">

        <div className="border-2 border-dashed border-blue-600/50 rounded-3xl p-16 text-center bg-[#050b16]">

          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto">
            <Upload size={40} className="text-blue-500" />
          </div>

          <h2 className="text-4xl font-bold mt-8">
            Drop your invoice file here
          </h2>

          <p className="text-gray-400 mt-4 text-xl">
            or click to browse. Supports CSV and XLSX files
          </p>

          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="file-input file-input-bordered mt-6"
          />

          <div className="flex justify-center gap-8 mt-8 text-gray-400">
            <div className="flex items-center gap-2">
              <FileText size={18} />
              CSV
            </div>

            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} />
              XLSX
            </div>
          </div>

          {file && (
            <p className="mt-6 text-green-400">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleAnalyze}
            className="btn bg-blue-600 hover:bg-blue-700 border-none text-white px-10"
          >
            <BarChart3 size={18} />
            Analyze Invoices
          </button>
          {result && (
  <div className="mt-6 bg-[#050b16] p-6 rounded-xl">
    <p>Total invoices: {result.total}</p>
    <p>Suspicious: {result.suspicious}</p>
    <p>Safe: {result.safe}</p>
  </div>
)}
        </div>

        {/* Expected Format Card */}
        <div className="mt-16 bg-[#050b16] border border-gray-800 rounded-3xl p-8">

          <h3 className="text-3xl font-bold mb-8">
            Expected File Format
          </h3>

          <div className="overflow-x-auto">

            <table className="table">
              <thead>
                <tr className="text-gray-400">
                  <th>invoice_number</th>
                  <th>vendor</th>
                  <th>amount</th>
                  <th>freight_cost</th>
                  <th>quantity</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>INV-001</td>
                  <td>Vendor Name</td>
                  <td>10000</td>
                  <td>500</td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

      </div>
    </section>
  );
}
