"use client";

import Link from "next/link"
import Ratings from "./ratings"
import { useEffect, useState } from "react";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import ProductDetailsCard from "./product-details-card";

const ProductCard = ({product, isEvent} : {product : any, isEvent ?: boolean}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(isEvent && product?.ending_date) {
        const interval = setInterval(() => {
            const endTime = new Date(product.ending_date).getTime();
            const now = new Date().getTime();
            const diff = endTime - now;

            if(diff <= 0) {
                setTimeLeft("Expired");
                clearInterval(interval);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

            setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price`)
        }, 60000);

        return () => clearInterval(interval);
    }
    return
  }, [isEvent, product?.ending_date])

  return (
    <div className="w-full h-max min-h-[350px] bg-white relative rounded-lg">
        { isEvent && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
                OFFER
            </div>
        )}

        {product?.stock <= 5 && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-slate-700 text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
                Limited Stock
            </div>
        )}

        <Link 
            href={`/product/${product?.slug}`}
        >
            <img 
                src={product?.images[0].url || "https://images.unsplash.com/photo-1635405074683-96d6921a2a"} 
                alt={product.title} 
                width={300}
                height={300}
                className="w-full h-[200px] object-cover mx-auto rounded-t-md"
            />
        </Link>

        <Link 
            href={`/shop/${product?.shop?.id}`}
            className="block text-blue-500 text-sm font-medium my-2 px-2"
        >
            {product?.shop?.name}
        </Link>

        <Link 
            href={`/product/${product?.slug}`}
        >
            <h3 className="text-base font-semibold px-2 text-gray-800 line-clamp-1">
                {product?.title}
            </h3>
        </Link>

        <div className="mt-2 px-2">
            <Ratings rating={product?.rating} />
        </div>

        <div className="mt-3 flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                    ${product?.sale_price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                    ${product?.regular_price}
                </span>
            </div>

            <span className="text-sm text-green-500 font-medium">
                {product.totalSales} sold
            </span>
        </div>

        {isEvent && timeLeft && (
            <div className="mt-2">
                <span className="inline-block text-xs bg-orange-100 text-orange-500">
                    {timeLeft}
                </span>
            </div>
        )}

        <div className="absolute flex flex-col gap-3 right-3 top-10 z-10">
            <div className="bg-white rounded-full p-[6px] shadow-md">
                <Heart  
                    className="cursor-pointer hover:scale-110 transition"
                    size={22}
                    fill="red"
                    stroke="red"
                />
            </div>

            <div className="bg-white rounded-full p-[6px] shadow-md">
                <Eye  
                    className="cursor-pointer tex-[#4b5563] hover:scale-110 transition"
                    size={22}
                    onClick={() => setOpen(!open)}
                />
            </div>

            <div className="bg-white rounded-full p-[6px] shadow-md">
                <ShoppingBag  
                    className="cursor-pointer tex-[#4b5563] hover:scale-110 transition"
                    size={22}
                />
            </div>
        </div>

        {open && (
            <ProductDetailsCard data={product} setOpen={setOpen} />
        )}
    </div>
  )
}

export default ProductCard