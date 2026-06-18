"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", freight: 1200 },
  { month: "Feb", freight: 1800 },
  { month: "Mar", freight: 1500 },
  { month: "Apr", freight: 2200 },
  { month: "May", freight: 2800 },
  { month: "Jun", freight: 3200 },
];

export default function FreightChart() {
  return (
    <div className="w-full h-[400px] bg-base-100 rounded-xl p-4">
      <h2 className="text-xl font-bold mb-4">
        Freight Cost Trend
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="freight"
            stroke="#4F46E5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}