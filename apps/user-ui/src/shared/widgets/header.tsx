"use client"

import Link from "next/link"
import { HeartIcon, Search, ShoppingCart } from "lucide-react"
import ProfileIcon from "../../assets/svg/profile-icon"
import HeaderBottom from "./header-bottom"
import useUser from "../../hooks/useUser"
import { useState } from "react"
import axiosInstance from "../../utils/axiosInstance"
import { useStore } from "../../store"

const Header = () => {
  const { user, isLoading } = useUser();

  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const handleSearchClick = async () => {
    if(!searchQuery.trim()) return;
    setLoadingSuggestion(true);

    try {
      const res = await axiosInstance.get(`/product/api/search-products?q=${encodeURIComponent(searchQuery)}`);
      setSuggestions(res.data.products.slice(0,10));
      setLoadingSuggestion(false);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  }

  return (
    <div className="w-full bg-white font-Poppins">
        <div className="w-[80%] py-5 m-auto flex items-center justify-between">
          <div>
            <Link href={"/"}>
              <span className="text-3xl font-semibold ">Eshop</span>
            </Link>
          </div>

          <div className="w-[50%] relative">
            <input 
              type="text" 
              value={searchQuery}
              placeholder="Search for products..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 font-medium font-Poppins border-[2.5px] border-[#3489FF] outline-none h-[55px]" 
            />

            <div
              onClick={handleSearchClick}  
              className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF] absolute top-0 right-0"
            >
              <Search
                className="text-white"
              />
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute w-full top-[60px] bg-white border z-50">
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={() => {
                      setSuggestions([]);
                      setSearchQuery("");
                    }}
                    className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition-colors font-medium"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )} 
            {loadingSuggestion && (
              <div className="absolute w-full top-[60px] bg-white border z-50">
                Searching ... 
              </div>
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              { !isLoading && user ? (
                <>
                  <Link 
                    href={"/profile"}
                    className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                  >
                    <ProfileIcon />
                  </Link>

                  <Link href={"/profile"}>
                    <span className="block font-medium">Hello,</span>
                    <span className="font-medium capitalize">{user?.name?.split(" ")[0]}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href={"/login"}
                    className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                  >
                    <ProfileIcon />
                  </Link>
                  
                  <Link href={"/login"}>
                    <span className="block font-medium">Hello,</span>
                    <span className="font-medium">{ isLoading ? ' ... ' : 'Sign In'}</span>
                  </Link>
                </>
              )}

            </div>

            <div className="flex items-center gap-5">
              <Link href={"/wishlist"} className="relative">
                <HeartIcon />
                <div className="absolute w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center top-[-10px] right-[-10px]">
                  <span className="text-white font-medium text-sm">{wishlist?.length}</span>
                </div>
              </Link>

              <Link href={"/cart"} className="relative">
                <ShoppingCart />
                <div className="absolute w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center top-[-10px] right-[-10px]">
                  <span className="text-white font-medium text-sm">{cart.length}</span>
                </div>
              </Link>
            </div>
          </div>
          
        </div>

        <div className="border-b border-b-[#99999938]" />
        
        <HeaderBottom />
    </div>
  )
}

export default Header