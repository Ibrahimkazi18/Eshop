"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Ratings from "./ratings";
import { Heart, MapPin, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductDetailsCardProps {
    data : any;
    setOpen : (open: boolean) => void;
}

const ProductDetailsCard = ({data, setOpen} : ProductDetailsCardProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
  const router = useRouter();

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  
  return (
    <div
        className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50"
        onClick={() => setOpen(false)}
    >
        <div 
            className="w-[90%] md:w-[70%] md:mt-14 2xl:mt-0 h-max overflow-scroll min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="w-full flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-full">
                    <Image 
                        src={data?.images?.[activeImage]?.url || "/placeholder.png"}
                        alt={data?.title}
                        width={400}
                        height={400}
                        className="w-full object-contain rounded-lg"                    
                    />

                    {/* Thumbnails */}
                    <div className="flex gap-2 mt-4">
                        {data?.images?.map((image: any, index: number) => (
                            <div 
                                key={index} 
                                className={`cursor-pointer border rounded-md ${
                                    activeImage === index 
                                        ? "border-gray-500 pt-1" 
                                        : "border-transparent"
                                    }`
                                }
                                onClick={() => setActiveImage(index)}
                            >
                                <Image 
                                    src={image?.url}
                                    alt={`Thumbnail ${data?.title}`}
                                    width={80}
                                    height={80}
                                    className="rounded-md"                    
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
                    {/* Seller Info */}
                    <div className="border-b relative pb-3 border-gray-300 flex items-center justify-between">
                        <div className="flex items-start gap-3">
                            {/* Shop Logo */}
                            <Image 
                                src={data?.shop?.avatar[0].url}
                                alt="Shop Logo"
                                width={60}
                                height={60}
                                className="rounded-full w-[60px] h-[60px] object-cover"
                            />

                            <div>
                                <Link 
                                    href={`/shop/${data?.shop?.id}`}
                                    className="text-lg font-medium"
                                >
                                    {data?.shop?.name}
                                </Link>

                                {/* Shop ratings */}
                                <span className="block mt-1">
                                    <Ratings rating={data?.shop?.ratings}/>
                                </span>

                                {/* Shop location */}
                                <p className="text-gray-600 mt-1 flex items-center gap-1">
                                    <MapPin size={20} /> {" "}
                                    {data?.shop?.address.split(",")[data?.shop?.address.split(",").length - 1] || "Location not available"}
                                </p>
                            </div>
                        </div>

                        {/* Chat with seller button */}
                        <button
                            className="flex cursor-pointer px-2 items-center py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-110 transition"
                            onClick={() => router.push(`/inbox?shopId=${data?.shop?.id}`)}
                        >
                            💬 Chat with Seller
                        </button>

                        <button
                            className="w-full absolute top-[-5px] right-[-5px] cursor-pointer flex justify-end my-2 mt-[-10px]"
                        >
                            <X size={25} onClick={() => setOpen(false)}/>
                        </button>
                    </div>

                    <h3 className="text-xl font-semibold mt-3 font-Poppins">
                        {data?.title}
                    </h3>

                    <p className="w-full mt-2 text-gray-700 whitespace-pre-wrap">
                        {data?.short_descirption || "No description available."}
                    </p>

                    {data?.brand && (
                        <p className="mt-2">
                            <strong>Brand:</strong> {data?.brand}
                        </p>
                    )}

                    {/* Color and Size options */}
                    <div className="flex flex-col md:flex-row items-start gap-5 mt-4">
                        {/* Color options */}
                        {data?.colors?.length > 0 && (
                            <div>
                                <strong>Color:</strong>
                                <div className="flex gap-2 mt-1">
                                    {data.colors.map((color: string, index: number) => (
                                        <button 
                                            key={index}
                                            className={`w-8 h-8 cursor-pointer rounded-full border-2 transition ${
                                                isSelected === color
                                                    ? "border-gray-400 scale-110 shadow-md"
                                                    : "border-transparent"
                                            }`}
                                            onClick={() => setIsSelected(color)}
                                            style={{ backgroundColor : color }}
                                        >
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Size options */}
                        {data?.sizes?.length > 0 && (
                            <div>
                                <strong>Size:</strong>
                                <div className="flex gap-2 mt-1">
                                    {data.sizes.map((size: string, index: number) => (
                                        <button 
                                            key={index}
                                            className={`px-4 py-1 cursor-pointer rounded-md ${
                                                isSizeSelected === size
                                                    ? "bg-gray-800 text-white"
                                                    : "bg-gray-300 text-black"
                                            }`}
                                            onClick={() => setIsSizeSelected(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price section */}
                    <div className="mt-5 flex items-center gap-4">
                        <h3 className="text-2xl font-semibold text-gray-900">
                            ${data?.sale_price}
                        </h3>
                        <h3 className="text-lg line-through text-red-600">
                            ${data?.regular_price}
                        </h3>
                    </div>

                    <div className="mt-5 flex items-center gap-5">
                        <div className="flex items-center rounded-md">
                            <button
                                className="px-3 py-1 cursor-pointer bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-l-md hover:text-white"
                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                            >
                                -
                            </button>
                            <span className="px-4 py-1 bg-gray-100">{quantity}</span>
                            <button
                                className="px-3 py-1 cursor-pointer bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-r-md"
                                onClick={() => setQuantity((prev) => prev + 1)}
                            >
                                +
                            </button>
                        </div>

                        <button
                            className={`flex items-center gap-2 px-4 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-lg transition`}
                        >
                            <ShoppingCart />
                            Add to Cart
                        </button>

                        <button
                            className="opacity-[.7] cursor-pointer"
                        >
                            <Heart size={30} fill="red" color="transparent"/>
                        </button>
                    </div>

                    <div className="mt-3">
                        {
                            data?.stock > 0 
                                ? (
                                    <span className="text-green-600 font-semibold">In Stock</span>
                                )
                                : (
                                    <span className="text-red-600 font-semibold">Out of Stock</span>
                                )
                        }
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                        Estimated Delivery:{" "}
                        <strong>{estimatedDelivery.toDateString()}</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductDetailsCard