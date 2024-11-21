import { useGetDashboardMetricsQuery } from "@/src/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  return (
    <div className="row-span-3 xl:row-span-6 bg-gradient-to-tr from-blue-50 to-blue-100 shadow-md rounded-3xl p-6 overflow-hidden hover:shadow-lg border border-gray-200 transition">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Popular Products</h3>
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts.map((product) => (
              <div
                key={product.productId}
                className="flex justify-between items-center p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    IMG
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold text-blue-600">${product.price}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                  <p className="text-sm text-gray-500">{Math.round(product.stockQuantity / 1000)}k Sold</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;
