"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ShieldAlert, ShieldCheck, Loader2, Search, Package, DollarSign, Truck, AlertTriangle } from "lucide-react"

interface FormData { quantity:string; dollars:string; freight:string; totalItemDollars:string }
interface AnalysisResult { status:"safe"|"suspicious"; confidence:number; riskFactors:string[] }

export default function FraudDetectionPage(){
 const [formData,setFormData]=useState<FormData>({quantity:"",dollars:"",freight:"",totalItemDollars:""})
 const [isLoading,setIsLoading]=useState(false)
 const [result,setResult]=useState<AnalysisResult|null>(null)
 const handleInputChange=(field:keyof FormData,value:string)=>setFormData(p=>({...p,[field]:value}))

const handleAnalyze = async () => {
  if (!formData.quantity || !formData.dollars || !formData.freight) return;

  try {
    setIsLoading(true);

    const payload = {
      invoice_quantity: Number(formData.quantity),
      invoice_dollars: Number(formData.dollars),
      Freight: Number(formData.freight),
      total_item_quantity: Number(formData.quantity),
      total_item_dollars: Number(formData.totalItemDollars || 0),
    };

    const response = await fetch("https://invoice-nalw.onrender.com/predict-flag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();

    setResult({
      status: data.risk?.toLowerCase() === "safe" ? "safe" : "suspicious",
      confidence: data.confidence ?? 95,
      riskFactors:
        data.riskFactors ??
        [
          data.risk === "Safe"
            ? "No risk factors detected"
            : "Suspicious invoice pattern detected",
        ],
    });
  } catch (error: any) {
    console.error(error);
    alert(error.message || "Could not analyze invoice");
  } finally {
    setIsLoading(false);
  }
};
 const inputFields=[
  {key:'quantity',label:'Invoice Quantity',icon:Package,placeholder:'e.g. 100'},
  {key:'dollars',label:'Total Dollars',icon:DollarSign,placeholder:'e.g. 10000'},
  {key:'freight',label:'Freight Cost',icon:Truck,placeholder:'e.g. 500'},
  {key:'totalItemDollars',label:'Total Item Dollars',icon:DollarSign,placeholder:'e.g. 9500'}]

 return <DashboardLayout title="Invoice Fraud Detection" description="Analyze invoices for suspicious patterns"><div className="grid gap-8 lg:grid-cols-2"><div className="glass rounded-xl p-6"><div className="space-y-4">{inputFields.map((field)=> <div key={field.key}><label className="flex items-center gap-2 text-sm font-medium"><field.icon className="h-4 w-4" />{field.label}</label><Input type="number" placeholder={field.placeholder} value={formData[field.key as keyof FormData]} onChange={(e)=>handleInputChange(field.key as keyof FormData,e.target.value)} /></div>)}<Button onClick={handleAnalyze} disabled={isLoading} className="w-full gap-2">{isLoading?<><Loader2 className="h-4 w-4 animate-spin"/>Analyzing...</>:<><Search className="h-4 w-4"/>Analyze Invoice</>}</Button></div></div><div>{result ? <div className={cn('glass rounded-xl p-6',result.status==='safe'?'border-green-500/30':'border-red-500/30')}><div className="flex items-center gap-4">{result.status==='safe'?<ShieldCheck className="h-8 w-8 text-green-500"/>:<AlertTriangle className="h-8 w-8 text-red-500"/>}<div><p className="text-2xl font-bold uppercase">{result.status}</p><p>{result.confidence}% confidence</p></div></div><ul className="mt-4 space-y-2">{result.riskFactors.map((f,i)=><li key={i}>{f}</li>)}</ul></div> : <div className="glass rounded-xl p-6 text-center"><ShieldAlert className="mx-auto h-8 w-8"/><p>No Analysis Yet</p></div>}</div></div></DashboardLayout>
}
