"use client";

import { useCreateProductMutation, useGetProductsQuery } from "@/src/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/src/app/(components)/Header";
import Rating from "@/src/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();

  const handleCreateProduct = async (productData: ProductFormData): Promise<void> => {
    await createProduct(productData);
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-600 py-10">
        Failed to fetch products.
      </div>
    );
  }

  return (
    <div className="mx-auto px-6 py-6 max-w-6xl">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 w-5 h-5 text-gray-500" />
          <input
            className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Product
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div
            key={product.productId}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 p-6 flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
              IMG
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 text-sm">${product.price.toFixed(2)}</p>
            <p className="text-gray-500 text-sm">Stock: {product.stockQuantity}</p>
            {product.rating && (
              <div className="mt-3">
                <Rating rating={product.rating} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE PRODUCT MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />
    </div>
  );
};

export default Products;
