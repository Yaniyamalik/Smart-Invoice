"use client"

import { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Trash2,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface InvoiceResult {
  id: string
  invoiceNumber: string
  vendor: string
  amount: number
  freightCost: number
  predictedFreight: number
  fraudStatus: "safe" | "suspicious" | "high-risk"
  confidence: number
  riskFactors: string[]
}

const mockResults: InvoiceResult[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    vendor: "Global Shipping Co.",
    amount: 12500,
    freightCost: 890,
    predictedFreight: 875,
    fraudStatus: "safe",
    confidence: 96.2,
    riskFactors: [],
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    vendor: "Express Logistics Ltd.",
    amount: 8750,
    freightCost: 2100,
    predictedFreight: 612,
    fraudStatus: "high-risk",
    confidence: 94.8,
    riskFactors: ["Freight 243% above predicted", "New vendor relationship"],
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    vendor: "Pacific Freight Inc.",
    amount: 45000,
    freightCost: 3200,
    predictedFreight: 3150,
    fraudStatus: "safe",
    confidence: 98.1,
    riskFactors: [],
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    vendor: "Continental Carriers",
    amount: 6200,
    freightCost: 980,
    predictedFreight: 434,
    fraudStatus: "suspicious",
    confidence: 87.5,
    riskFactors: ["Freight 126% above predicted"],
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    vendor: "Atlantic Transport",
    amount: 28900,
    freightCost: 2020,
    predictedFreight: 2023,
    fraudStatus: "safe",
    confidence: 99.2,
    riskFactors: [],
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-006",
    vendor: "Quick Ship Solutions",
    amount: 3400,
    freightCost: 890,
    predictedFreight: 238,
    fraudStatus: "high-risk",
    confidence: 91.3,
    riskFactors: ["Freight 274% above predicted", "Unusual delivery delays", "Pattern mismatch"],
  },
]

export default function BulkAnalysisPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<InvoiceResult[] | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".xlsx"))) {
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

 const handleProcess = async () => {
  if (!file) return;

  try {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://invoice-nalw.onrender.com/bulk-analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();
    setResults(data.results);
  } catch (error) {
    console.error(error);
    alert("Could not process file");
  } finally {
    setIsProcessing(false);
  }
};
  const handleClear = () => {
    setFile(null)
    setResults(null)
    setProgress(0)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <ShieldCheck className="h-4 w-4 text-green-500" />
      case "suspicious":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "high-risk":
        return <ShieldAlert className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      safe: "bg-green-500/10 text-green-500 border-green-500/20",
      suspicious: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "high-risk": "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return styles[status as keyof typeof styles] || ""
  }

  const summaryStats = results
    ? {
        total: results.length,
        safe: results.filter((r) => r.fraudStatus === "safe").length,
        suspicious: results.filter((r) => r.fraudStatus === "suspicious").length,
        highRisk: results.filter((r) => r.fraudStatus === "high-risk").length,
        totalAmount: results.reduce((sum, r) => sum + r.amount, 0),
        potentialSavings: results
          .filter((r) => r.fraudStatus !== "safe")
          .reduce((sum, r) => sum + (r.freightCost - r.predictedFreight), 0),
      }
    : null

  return (
    <DashboardLayout
      title="Bulk Invoice Analysis"
      description="Upload and analyze multiple invoices at once"
    >
      {/* Upload Section */}
      {!results && (
        <div className="mx-auto max-w-3xl">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/30",
              file && "border-primary/50 bg-primary/5"
            )}
          >
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={isProcessing}
            />

            {!file ? (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Drop your invoice file here</h3>
                <p className="mt-2 text-muted-foreground">
                  or click to browse. Supports CSV and Excel files.
                </p>
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4" />
                    XLSX
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">{file.name}</h3>
                <p className="mt-2 text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB - Ready to process
                </p>
              </>
            )}
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing invoices...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="gap-2 px-8"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" />
                  Analyze Invoices
                </>
              )}
            </Button>
            {file && !isProcessing && (
              <Button variant="outline" onClick={handleClear} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Sample Format */}
          <div className="mt-12 glass rounded-xl p-6">
            <h4 className="mb-4 font-semibold">Expected File Format</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium text-muted-foreground">invoice_number</th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">vendor</th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">amount</th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">freight_cost</th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">quantity</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="py-2">INV-001</td>
                    <td className="py-2">Vendor Name</td>
                    <td className="py-2">10000</td>
                    <td className="py-2">500</td>
                    <td className="py-2">100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <>
          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Total Analyzed</p>
              <p className="mt-1 text-2xl font-bold">{summaryStats?.total}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Safe</p>
              <p className="mt-1 text-2xl font-bold text-green-500">{summaryStats?.safe}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Suspicious</p>
              <p className="mt-1 text-2xl font-bold text-yellow-500">{summaryStats?.suspicious}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="mt-1 text-2xl font-bold text-red-500">{summaryStats?.highRisk}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="mt-1 text-2xl font-bold">${summaryStats?.totalAmount.toLocaleString()}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Potential Savings</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                ${summaryStats?.potentialSavings.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button variant="outline" onClick={handleClear} className="gap-2">
                <Upload className="h-4 w-4" />
                New Analysis
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <div className="glass overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invoice</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Vendor</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Freight</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Predicted</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Confidence</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((invoice) => (
                    <>
                      <tr
                        key={invoice.id}
                        className={cn(
                          "border-b border-border/50 transition-colors hover:bg-muted/20",
                          expandedRow === invoice.id && "bg-muted/20"
                        )}
                      >
                        <td className="px-4 py-3 font-medium">{invoice.invoiceNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground">{invoice.vendor}</td>
                        <td className="px-4 py-3 text-right">${invoice.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">${invoice.freightCost.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          ${invoice.predictedFreight.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                                getStatusBadge(invoice.fraudStatus)
                              )}
                            >
                              {getStatusIcon(invoice.fraudStatus)}
                              {invoice.fraudStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">{invoice.confidence}%</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedRow(expandedRow === invoice.id ? null : invoice.id)
                              }
                              className="h-8 w-8 p-0"
                            >
                              {expandedRow === invoice.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedRow === invoice.id && (
                        <tr key={`${invoice.id}-expanded`} className="bg-muted/10">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                              <div className="glass rounded-lg p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <TrendingUp className="h-4 w-4" />
                                  Freight Variance
                                </div>
                                <p
                                  className={cn(
                                    "mt-1 text-lg font-semibold",
                                    invoice.freightCost > invoice.predictedFreight
                                      ? "text-red-500"
                                      : "text-green-500"
                                  )}
                                >
                                  {invoice.freightCost > invoice.predictedFreight ? "+" : ""}
                                  {(
                                    ((invoice.freightCost - invoice.predictedFreight) /
                                      invoice.predictedFreight) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </p>
                              </div>
                              <div className="glass rounded-lg p-4 sm:col-span-2">
                                <p className="text-sm text-muted-foreground">Risk Factors</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {invoice.riskFactors.length > 0 ? (
                                    invoice.riskFactors.map((factor, i) => (
                                      <span
                                        key={i}
                                        className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-500"
                                      >
                                        {factor}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500">
                                      No risk factors detected
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
