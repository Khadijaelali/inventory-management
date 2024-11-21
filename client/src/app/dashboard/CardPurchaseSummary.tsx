import { useGetDashboardMetricsQuery } from "@/src/state/api";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardPurchaseSummary = () => {
  const { data, isLoading } = useGetDashboardMetricsQuery();
  const purchaseData = data?.purchaseSummary || [];
  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;

  return (
    <div className="row-span-2 xl:row-span-3 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md rounded-3xl p-6 hover:shadow-lg border border-gray-200 transition">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-3 text-indigo-700">Purchase Summary</h2>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">Purchased</p>
              <p className="text-2xl font-bold text-indigo-600">
                ${lastDataPoint ? lastDataPoint.totalPurchased.toLocaleString() : "0.00"}
              </p>
              {lastDataPoint && (
                <p
                  className={`text-sm ${
                    (lastDataPoint.changePercentage || 0) >= 0 ? "text-green-500" : "text-red-500"
                  } flex items-center mt-1`}
                >
                  {(lastDataPoint.changePercentage || 0) >= 0 ? (
                    <TrendingUp className="w-5 h-5 mr-1" />
                  ) : (
                    <TrendingDown className="w-5 h-5 mr-1" />
                  )}
                  {Math.abs(lastDataPoint.changePercentage || 0)}%
                </p>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={purchaseData}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="totalPurchased"
                stroke="#6366f1"
                fill="#c7d2fe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default CardPurchaseSummary;
