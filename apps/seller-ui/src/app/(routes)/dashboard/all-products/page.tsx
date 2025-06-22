"use client";

import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Pencil, Trash, Eye, Plus, BarChart, Star, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";
import DeleteConfirmationModal from "apps/seller-ui/src/shared/components/delete-confirmation-modal";
import toast from "react-hot-toast";

const fetchProducts = async () => {
  const res = await axiosInstance.get("/product/api/get-shop-products");
  return res?.data?.products;
}

const AllProducts = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  const queryClient = useQueryClient();

  const { data : products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId : string) => {
      const response = await axiosInstance.delete(`/product/api/delete-product/${productId}`);
      toast(`${response.data.message}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["shop-products"]});
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  })

  const restoreProductMutation = useMutation({
    mutationFn: async (productId : string) => {
      const response = await axiosInstance.put(`/product/api/restore-product/${productId}`);
      toast(`${response.data.message}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["shop-products"]});
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  })

  const openAnalytics = (product : any) => {
    setSelectedProduct(product);
    setShowAnalytics(true);
  }

  const openDeleteModal = (product : any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "image",
        header : "Image",
        cell : ({ row } : any ) => {
          return (
            <Image 
              src={row.original.images[0].url}
              alt="product image"
              width={200}
              height={200}
              className="w-12 h-12 rounded-md object-cover"
            />
          )
        }
      },
      {
        accessorKey: "name",
        header : "Product Name",
        cell : ({ row } : any ) => {
          const truncatedTitle = 
            row.original.title.length > 25 
              ? `${row.original.title.substring(0, 25)} ... ` 
              : row.original.title;

          return (
            <Link
              href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
              className="text-blue-400 hover:underline"
              title={row.original.title}
            >
              {truncatedTitle}
            </Link>
          )
        }
      },
      {
        accessorKey: "price",
        header : "Price",
        cell : ({ row } : any ) => <span>${row.original.sale_price}</span>
      },
      {
        accessorKey: "stock",
        header : "Stock",
        cell : ({ row } : any ) => (
          <span
            className={row.original.stock < 10 ? "text-red-500" : "text-white"}
          >
            {row.original.stock} left
          </span>
        )
      },
      {
        accessorKey: "category",
        header : "Category",
        cell : ({ row } : any ) => (
          <span
            className="text-white"
          >
            {row.original.category}
          </span>
        )
      },
      {
        accessorKey: "rating",
        header : "Rating",
        cell : ({ row } : any ) => (
          <div
            className="flex items-center gap-1 text-yellow-400"
          >
            <Star fill="#fde047" size={18} /> {" "}
            <span className="text-white">{row.original.ratings || 5}</span>
          </div>
        )
      },
      {
        header : "Actions",
        cell : ({ row } : any ) => (
          <div
            className="flex gap-3"
          >
            <Link
              href={`/product/${row.original.id}`}
              className="text-blue-400 hover:text-blue-300 transition"
            >
              <Eye size={18} />
            </Link>

            <Link
              href={`/product/edit/${row.original.id}`}
              className="text-yellow-400 hover:text-yellow-300 transition"
            >
              <Pencil size={18} />
            </Link>

            <button
              className="text-green-400 hover:text-green-300 transition"
              onClick={() => openAnalytics(row.original)}
            >
              <BarChart size={18} />
            </button>

            {row.original.isDeleted ? (
              <button
                className="text-orange-400 hover:text-orange-300 transition"
                onClick={() => openDeleteModal(row.original)}
              >
                <History size={18} />
              </button>
            ) : (
              <button
                className="text-red-400 hover:text-red-300 transition"
                onClick={() => openDeleteModal(row.original)}
              >
                <Trash size={18} />
              </button>
            )}
          </div>
        )
      },
    ], 
    []
  );

  const table = useReactTable({
    data : products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    state : {globalFilter},
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full min-h-screen p-8 text-white">
      {/* Heading */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
          All Products
        </h2>

        <Link
          href={"/dashboard/create-product"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-between gap-2"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center mb-4">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span className="text-white">All Products</span>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center rounded-md flex-1 bg-gray-900 p-2">
        <Search size={18} className="text-gray-400 mr-2" />
        <input 
          type="text"
          placeholder="Search products..."
          className="w-full bg-transparent outline-none text-white"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg p-4">
        {isLoading ? (
          <p className="text-center text-white">Loading products ... </p>
        ) : (
          <table className="w-full text-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3 text-left">
                      { header.isPlaceholder 
                          ? null 
                          : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800 transition hover:bg-gray-900"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal 
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => deleteProductMutation.mutate(selectedProduct.id)}
            onRestore={() => restoreProductMutation.mutate(selectedProduct.id)}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  )
}

export default AllProducts