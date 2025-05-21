"use client";

import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems } from "../../config/constants";
import Link from "next/link";
import ProfileIcon from "../../assets/svg/profile-icon";
import useUser from "../../hooks/useUser";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, isLoading } = useUser();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
        if(window.scrollY > 100) {
            setIsSticky(true);
        }
        else {
            setIsSticky(false);
        }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [])
  

  return (
    <div className={`w-full transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 z-[100] bg-white shadow-lg' : 'relative'}`}>
        <div className={`w-[80%] relative m-auto flex items-center justify-between ${isSticky ? 'pt-3' : 'py-0'}`}>
            {/* All dropdowns */}
            <div 
                className={`w-[260px] ${isSticky && 'mb-2'} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`}
                onClick={() => setShow(!show)}
            >
                <div className="flex items-center gap-2">
                    <AlignLeft color="white"/>
                    <span className="text-white font-medium">All Departments</span>
                </div>
                <ChevronDown color="white"/>
            </div>

            {/* Dropdown Menu */}
            { show && (
                <div className={`absolute left-0 ${isSticky ? 'top-[70px]' : 'top-[50px]'} w-[260px] h-[400px] bg-[#f5f5f5]`}>
                </div>
            )}

            {/* Navigation Links */}
            <div className="flex items-center">
                {navItems.map((item, index) => (
                    <Link 
                        href={item.href} 
                        key={index}
                        className="px-5 font-medium text-lg"
                    >
                            {item.title}
                    </Link>
                ))}
            </div>

            <div>
                {isSticky && (
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
                            <span className="text-white font-medium text-sm">0</span>
                            </div>
                        </Link>

                        <Link href={"/cart"} className="relative">
                            <ShoppingCart />
                            <div className="absolute w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center top-[-10px] right-[-10px]">
                            <span className="text-white font-medium text-sm">0</span>
                            </div>
                        </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default HeaderBottom