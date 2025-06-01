"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteDiscountCodeModal from "apps/seller-ui/src/shared/components/modal/delete.discount.code.modal";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
import { AxiosError } from "axios";
import { ChevronRight, Plus, Trash, X } from "lucide-react"
import Link from "next/link";
import Input from "packages/components/input";
import { useState } from "react"
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const DiscountCodesPage = () => {
  const { register, control, reset, handleSubmit, formState : { errors }} = useForm({
    defaultValues : {
        public_name : "",
        discountType : "percentage",
        discountValue : "",
        discountCode : "",
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>();

  const queryClient = useQueryClient();

  const { data : discountCodes = [], isLoading} = useQuery({
    queryKey : ["shop-discounts"],
    queryFn : async () => {
        const response = await axiosInstance.get("/product/api/get-discount-codes");
        return response?.data?.discount_code || [];
    }
  })

  const createDiscountCodeMutation = useMutation({
    mutationFn : async (data) => {
        await axiosInstance.post("/product/api/create-discount-code", data);
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["shop-discounts"] });
        reset();
        setShowModal(false);
    }
  });

  const deleteDiscountCodeMutation = useMutation({
    mutationFn : async (discountId) => {
        console.log(discountId);
        await axiosInstance.delete(`/product/api/delete-discount-code/${discountId}`);
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["shop-discounts"] });
        setShowDeleteModal(false);
    }
  });

  const handleDeleteClick = async (discount : any) => {
    console.log(discount);
    setSelectedDiscount(discount);
    setShowDeleteModal(true);
  }
  
  const onSubmit = async (data : any) => {
    if(discountCodes.length >= 8) {
        toast.error("You can only create upto 8 discount codes.");
        return
    }

    createDiscountCodeMutation.mutate(data);
  }

  return (
    <div className="w-full min-h-screen p-8 text-white">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl text-white font-semibold">Discount Codes</h2>

            <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() => setShowModal(true)}
            >
                <Plus size={18}/> Create Discount
            </button>
        </div>

        {/* Bread Crumbs */}
        <div className="flex items-center">
            <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
            <ChevronRight size={20} className="opacity-[.8]"/>
            <span className="">Discount Codes</span>
        </div>

        {/* existing codes */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 font-Poppins">Your Discount Codes</h3>

            { isLoading ? (
                <p className="text-gray-400 text-center">Loading discounts ... </p>
            ) : (
                <table className="w-full text-white">
                    <thead>
                        <tr className="border-b border-gray-800">
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Value</th>
                            <th className="p-3 text-left">Code</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            discountCodes.map((discount:any) => (
                                <tr 
                                    key={discount?.id}
                                    className="border-b border-gray-800 hover:bg-gray-800 transition"
                                >
                                    <td className="p-3">{discount?.public_name}</td>
                                    <td className="p-3 capitalize">
                                        {discount.discountType === "percentage"
                                            ? "Percentage (%)"
                                            : "Flat ($)"
                                        }
                                    </td>
                                    <td className="p-3">
                                        {discount.discountType === "percentage"
                                            ? `${discount.discountValue}%`
                                            : `$${discount.discountValue}`
                                        }
                                    </td>
                                    <td className="p-3">{discount.discountCode}</td>
                                    <td className="p-3">
                                        <button
                                            className="transition text-red-400 hover:text-red-300"
                                            onClick={() => handleDeleteClick(discount)}
                                        >
                                            <Trash size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table> 
            )}

            {discountCodes?.length === 0 && !isLoading && (
                <p className="block text-center text-gray-400 w-full pt-4">No discount codes exists for you, You can create them using the add discount code button.</p>
            )}
        </div>

        {/* Create discount modal */}
        {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                        <h3 className="text-xl text-white">Create Discount Code</h3>

                        <button
                            className="text-gray-400 hover:text-white"
                            onClick={() => setShowModal(false)}
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                        {/* Title */}
                        <Input 
                            label="Title (public name)"
                            type="text"
                            {...register("public_name", {
                                required : "Title is required"
                            })}
                        />
                        {errors.public_name && (
                            <p className="text-red-500 text-sm">
                                {errors.public_name.message}
                            </p>
                        )}

                        <div className="mt-4">
                            <label className="block font-semibold text-gray-300 mb-1">
                                Discount Type
                            </label>

                            <Controller 
                                control={control}
                                name="discountType"
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full border outline-none bg-transparent border-gray-700 rounded-lg p-2"
                                    >
                                        <option value="percentage" className="bg-black">Percentage (%)</option>
                                        <option value="flat" className="bg-black">Flat Amount ($)</option>
                                    </select>
                                )}
                            />

                            {errors.discountType && (
                                <p className="text-red-500 text-sm">
                                    {errors.discountType.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <Input 
                                label="Discount Value"
                                type="number"
                                min={1}
                                {...register("discountValue", {
                                    required : "Value is required"
                                })}
                            />
                            {errors.discountValue && (
                                <p className="text-red-500 text-sm">
                                    {errors.discountValue.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <Input 
                                label="Discount Code"
                                type="text"
                                {...register("discountCode", {
                                    required : "Code is required"
                                })}
                            />
                            {errors.discountCode && (
                                <p className="text-red-500 text-sm">
                                    {errors.discountCode.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={createDiscountCodeMutation.isPending}
                            className="mt-4 w-full bg-blue-500 hover:bg-blue-7 text-white py-2 rounded-md font-semibold flex items-center justify-center gap-4"
                        >
                            {createDiscountCodeMutation.isPending ? 'Creating ... ' : (<><Plus size={18}/> Create</>)}
                        </button>

                        {createDiscountCodeMutation.isError && (
                            <p className="text-red-500 text-sm mt-2">
                                {
                                    (
                                        createDiscountCodeMutation.error as AxiosError<{
                                            message : string
                                        }>
                                    )?.response?.data?.message || "Somethin went wrong!"
                                }
                            </p>
                        )}
                    </form>
                </div>
            </div>
        )}

        {/* Delete discount modal */}
        { showDeleteModal && selectedDiscount && (
            <DeleteDiscountCodeModal 
                discount={selectedDiscount}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => deleteDiscountCodeMutation.mutate(selectedDiscount?.id)}
            />
        ) }
    </div>
  )
}

export default DiscountCodesPage