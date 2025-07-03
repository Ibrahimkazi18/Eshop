"use client";

import { useDeviceTracking } from "apps/user-ui/src/hooks/useDeviceTracking";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useUser from "apps/user-ui/src/hooks/useUser"
import { useStore } from "apps/user-ui/src/store";
import Image from "next/image";
import Link from "next/link";

const WishlistPage = () => {
  const {user} = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  const addToCart = useStore((state : any) => state.addToCart);
  const removeFromWishlist = useStore((state : any) => state.removeFromWishlist);
  const wishlist = useStore((state : any) => state.wishlist);

  const decreaseQuantity = (id : string) => {
    useStore.setState((state : any) => ({
        wishlist: state.wishlist.map((item:any) => 
            item.id === id && item.quantity > 1 
                ? {...item, quantity : item.quantity - 1} 
                : item
        )
    }));
  }

  const increaseQuantity = (id : string) => {
    useStore.setState((state : any) => ({
        wishlist: state.wishlist.map((item:any) => 
            item.id === id && item.quantity < item.stock 
                ? {...item, quantity : (item.quantity ?? 1) + 1} 
                : item
        )
    }));
  }

  const removeItem = (id : string) => {
    removeFromWishlist(id, user, location, deviceInfo);
  }

  return (
    <div className="w-full bg-white mt-4">
        <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
            {/* Breadcrumb */}
            <div className="pb-[50px]">
                <h1 className="md:pt-p[50px] font-medium text-[44px] leading-[1] mb-[16px] font-Jost">
                    Wishlist
                </h1>
                <Link
                    href={"/"}
                    className="hover:underline text-[#55585b]"
                >
                    Home
                </Link>

                <span className="inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full"></span>
                <span className="text-[#55585b]">Wishlist</span>
            </div>

            {
                wishlist.length === 0 
                    ? (
                        <div className="text-center text-lg text-gray-600">
                            Your wishlist is empty! Start adding products.
                        </div>
                    )
                    : (
                        <div className="flex flex-col gap-10">
                            {/* Wishlist items table */}
                            <table className="w-full border-collapse">
                                <thead className="bg-[#f1f3f4]">
                                    <tr>
                                        <th className="py-3 text-left pl-4">Product</th>
                                        <th className="py-3 text-left">Price</th>
                                        <th className="py-3 text-left">Quantity</th>
                                        <th className="py-3 text-left">Action</th>
                                        <th className="py-3 text-left"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {wishlist?.map((item:any) => (
                                        <tr key={item.id} className="border-b border-b-[#0000000e]">
                                            <td className="flex items-center gap-3 p-4">
                                                <Image 
                                                    src={item.images[0]?.url} 
                                                    alt={item.title} 
                                                    width={80} 
                                                    height={80} 
                                                    className="rounded w-20 h-20" 
                                                />
                                                <span>{item.title}</span>
                                            </td>

                                            <td className="text-lg">
                                                ${item?.sale_price.toFixed(2)}
                                            </td>

                                            <td>
                                                <div className="flex items-center justify-center border border-gray-200 rounded-[20px] w-[90px] p-[2px]">
                                                    <button
                                                        className="text-black cursor-pointer text-xl"
                                                        onClick={() => decreaseQuantity(item.id)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4">
                                                        {item?.quantity}
                                                    </span>
                                                    <button
                                                        className="text-black cursor-pointer text-xl"
                                                        onClick={() => increaseQuantity(item.id)}
                                                    >
                                                        +
                                                    </button>
                                                </div> 
                                            </td>

                                            <td>
                                                <button
                                                    className="bg-[#2295FF] cursor-pointer text-white px-5 py-2 rounded-md hover:bg-[#007bff] transition-all"
                                                    onClick={() => addToCart(item, user, location, deviceInfo)}
                                                >
                                                    Add To Cart
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    className="text-[#818487] cursor-pointer hover:text-[#ff1826] transition duration-200"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    x Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
            }
        </div>
    </div>
  )
}

export default WishlistPage