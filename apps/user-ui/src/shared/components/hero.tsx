"use client";

import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="bg-[#115061] h-[85vh] flex flex-col justify-center w-full">
        <div className="md:w-[80%] w-[90%] m-auto md:flex h-full items-center">
            <div className="md:w-1/2">
                <p className="font-Roboto font-normal text-white pb-2 text-xl">
                    Starting from 40$
                </p>

                <h1 className="text-white text-6xl font-extrabold font-Roboto">
                    The best watch <br />
                    Collection 2025
                </h1>

                <p className="font-Oregano text-3xl pt-4 text-white">
                    Exclusive offer <span className="text-yellow-400">10%</span> off
                    this week
                </p>

                <br />

                <button
                    onClick={() => router.push(`/products`)}
                    className="w-[140px] gap-2 font-semibold h-[40px] hover:text-white border-2 border-white flex items-center justify-center rounded-md bg-white hover:bg-[#115061] text-[#115061] transition-all duration-300 ease-in-out"
                >
                    Shop Now <MoveRight />
                </button>
            </div>

            <div className="md:w-1/2 flex justify-center">
                <Image 
                    src={"https://ik.imagekit.io/ibrahimeshop/products/watches-removebg-preview.png?updatedAt=1750827827822"}
                    alt="hero image"
                    width={840}
                    height={599}
                />
            </div>
        </div>
    </div>
  )
}

export default Hero
