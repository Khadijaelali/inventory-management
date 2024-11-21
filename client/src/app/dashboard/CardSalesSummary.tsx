import { useGetDashboardMetricsQuery } from "@/src/state/api";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardSalesSummary = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  const salesData = data?.salesSummary || [];

  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum =
    salesData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

  const averageChangePercentage =
    salesData.reduce((acc, curr, _, array) => {
      return acc + curr.changePercentage! / array.length;
    }, 0) || 0;

  const highestValueData = salesData.reduce((acc, curr) => {
    return acc.totalValue > curr.totalValue ? acc : curr;
  }, salesData[0] || {});

  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return <div className="m-5">Failed to fetch data</div>;
  }

  return (
    <div className="row-span-3 xl:row-span-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow-lg rounded-3xl flex flex-col justify-between border border-gray-300 transition-all hover:shadow-2xl hover:border-gray-400">
      {isLoading ? (
        <div className="m-5 text-center animate-pulse">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-3xl p-6 text-white">
            <h2 className="text-xl font-semibold">Sales Summary</h2>
            <p className="text-sm opacity-80">Track your sales performance</p>
          </div>

          {/* BODY */}
          <div className="p-6">
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs text-gray-500">Total Sales Value</p>
                <span className="text-3xl font-bold text-blue-600">
                  $
                  {(totalValueSum / 1000000).toLocaleString("en", {
                    maximumFractionDigits: 2,
                  })}
                  m
                </span>
                <span className="text-green-500 text-sm ml-3">
                  <TrendingUp className="inline w-5 h-5" />
                  {averageChangePercentage.toFixed(2)}%
                </span>
              </div>
              <select
                className="shadow-sm border border-gray-300 bg-gray-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value);
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={salesData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}m`}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString("en")}`,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Bar
                  dataKey="totalValue"
                  fill="#3b82f6"
                  barSize={12}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER */}
          <div className="bg-gray-100 border-t border-gray-200 p-4 rounded-b-3xl">
            <div className="flex justify-between text-sm">
              <p>{salesData.length || 0} days tracked</p>
              <p>
                Highest Sales Date:{" "}
                <span className="font-bold text-blue-600">
                  {highestValueDate}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;
