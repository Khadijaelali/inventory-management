import {
  ExpenseByCategorySummary,
  useGetDashboardMetricsQuery,
} from "@/src/state/api";
import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type ExpenseSums = {
  [category: string]: number;
};

const colors = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"];

const CardExpenseSummary = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  const expenseSummary = dashboardMetrics?.expenseSummary[0];
  const expenseByCategorySummary =
    dashboardMetrics?.expenseByCategorySummary || [];

  const expenseSums = expenseByCategorySummary.reduce(
    (acc: ExpenseSums, item: ExpenseByCategorySummary) => {
      const category = `${item.category} Expenses`;
      const amount = parseInt(item.amount, 10);
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    },
    {}
  );

  const expenseCategories = Object.entries(expenseSums).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const totalExpenses = expenseCategories.reduce(
    (acc, category) => acc + category.value,
    0
  );
  const formattedTotalExpenses = totalExpenses.toFixed(2);

  return (
    <div className="row-span-3 bg-gradient-to-tr from-green-50 via-white to-green-100 shadow-lg rounded-3xl flex flex-col justify-between border border-gray-200 hover:shadow-2xl transition">
      {isLoading ? (
        <div className="m-5 text-gray-500 text-center">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div className="bg-green-100 p-5 rounded-t-3xl text-green-700">
            <h2 className="text-lg font-semibold">Expense Summary</h2>
            <p className="text-sm">Overview of expenses by category</p>
          </div>

          {/* BODY */}
          <div className="flex flex-col xl:flex-row justify-between items-center px-6 py-4 gap-4">
            {/* CHART */}
            <div className="relative w-full xl:w-2/3">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-green-700">
                <span className="font-bold text-2xl">${formattedTotalExpenses}</span>
                <p className="text-sm text-gray-500">Total Expenses</p>
              </div>
            </div>

            {/* LABELS */}
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              {expenseCategories.map((entry, index) => (
                <li key={`legend-${index}`} className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></span>
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>

          {/* FOOTER */}
          {expenseSummary && (
            <div className="bg-green-50 px-6 py-4 rounded-b-3xl flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Average:{" "}
                <span className="font-semibold text-green-600">
                  ${expenseSummary.totalExpenses.toFixed(2)}
                </span>
              </p>
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-5 h-5 mr-1" />
                <span>30% Increase</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardExpenseSummary;
