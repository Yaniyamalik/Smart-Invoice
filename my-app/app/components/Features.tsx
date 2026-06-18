import {
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  FileSpreadsheet,
  Activity,
} from "lucide-react";

const features = [
  {
    title: "Freight Cost Prediction",
    description:
      "ML models analyze historical patterns to predict costs with 99%+ accuracy, enabling better budget planning.",
    icon: TrendingUp,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    title: "Fraud Detection",
    description:
      "Anomaly detection algorithms instantly flag suspicious invoices, protecting your business from fraud.",
    icon: ShieldCheck,
    color: "text-cyan-400 bg-cyan-400/10",
  },
  {
    title: "Real-time Processing",
    description:
      "Process thousands of invoices in milliseconds with our optimized inference pipeline.",
    icon: Zap,
    color: "text-white bg-white/10",
  },
  {
    title: "Advanced Analytics",
    description:
      "Interactive dashboards with deep insights into spending patterns and cost optimization.",
    icon: BarChart3,
    color: "text-gray-300 bg-gray-300/10",
  },
  {
    title: "Batch Processing",
    description:
      "Upload bulk invoices for automated analysis and instant categorization.",
    icon: FileSpreadsheet,
    color: "text-green-400 bg-green-400/10",
  },
  {
    title: "Continuous Learning",
    description:
      "Models improve over time, adapting to your specific invoice patterns and vendors.",
    icon: Activity,
    color: "text-lime-400 bg-lime-400/10",
  },
];

export default function FeaturesPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 py-20">
      
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold">
          Powerful AI Features
        </h1>

        <p className="text-gray-400 text-xl mt-6">
          Everything you need to optimize invoice management
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 ml-20 mr-20">
        
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="card bg-base-100 h-auto w-max-sm border border-gray-800 shadow-xl hover:bg-[lab(47.6934%_38.5675_-81.9644)] transition duration-300"
            >
              <div className="card-body p-8">
                
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center ${feature.color}`}
                >
                  <Icon size={30} />
                </div>

                {/* Title */}
                <h2 className="card-title text-xl mt-4">
                  {feature.title}
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-md leading-8 mt-2">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}