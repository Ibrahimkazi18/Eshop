"use client"

import { useQuery } from "@tanstack/react-query"
import Hero from "../shared/components/hero"
import SectionTitle from "../shared/components/section-title"
import axiosInstance from "../utils/axiosInstance"
import ProductCard from "../shared/components/product-card"

const Home = () => {
  const { data : products, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-all-products?page=1&limit=10&type=sale");
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data : latestProducts } = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-all-products?page=1&limit=10&type=latest");
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="bg-[#f5f5f5]">
      <Hero />

      <div className="md:w-[80%] w-[90%] my-10 m-auto">
        <div className="mb-8">
          <SectionTitle title="Suggested Products" />
        </div>

        { 
          isLoading &&
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {Array.from({ length : 10 }).map((_, index) => (
                <div key={index} className="h-[250px] bg-gray-300  animate-pulse rounded-xl" />
              ))}
            </div>
        }
        { 
          !isLoading && !isError &&
            <div className="m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 pb-8">
              {products.map((product:any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
        }
      </div>
    </div>
  )
}

export default Home