import { useMutation } from "@tanstack/react-query";
import { categories } from "apps/seller-ui/src/config/constants";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";

interface createShopInterface {
    sellerId : string,
    setActiveStep : React.Dispatch<React.SetStateAction<number>>
}

const CreateShop = ({ sellerId, setActiveStep } : createShopInterface) => {

  const { register, handleSubmit, formState : { errors } } = useForm();

  const shopCreateMutation = useMutation({
    mutationFn: async (data:any) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/api/create-shop`, data);

        return response.data;
    },

    onSuccess: () => {
        setActiveStep(3);
    }
  })

  const onSubmit = async (data : any) => {
    shopCreateMutation.mutate({ ...data, sellerId });
  }

  const countWords = (text : string) => text.trim().split(/\s+/).length;
  
  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-2xl font-semibold text-center mb-4">
                Setup New Shop
            </h3>

            <label className="text-gray-700 block mb-1">Name <span className="text-red-500">*</span></label>
            <input 
                type="text" 
                placeholder="Shop Name" 
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                {...register("name", {
                    required: "Name is required.",
                })}
            />
            {errors.name && (
                <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
            )}

            <label className="text-gray-700 block mb-1">Bio <span className="text-gray-400">(Max 100 words)</span> <span className="text-red-500">*</span></label>
            <input
                type="text"
                placeholder="Shop Description" 
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                {...register("bio", {
                    required: "Shop bio is required.",
                    validate: (value) => countWords(value) <= 100 || "Bio cannot exceed 100 words"
                })}
            />
            {errors.bio && (
                <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
            )}

            <label className="text-gray-700 block mb-1">Address <span className="text-red-500">*</span></label>
            <input 
                type="text" 
                placeholder="Shop Address" 
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                {...register("address", {
                    required: "Address is required.",
                })}
            />
            {errors.address && (
                <p className="text-red-500 text-sm">{String(errors.address.message)}</p>
            )}

            <label className="text-gray-700 block mb-1">Opening Hours <span className="text-red-500">*</span></label>
            <input 
                type="text" 
                placeholder="e.g. Mon-Fri 9AM - 6PM" 
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                {...register("opening_hours", {
                    required: "Opening Hours is required.",
                })}
            />
            {errors.opening_hours && (
                <p className="text-red-500 text-sm">{String(errors.opening_hours.message)}</p>
            )}

            <label className="text-gray-700 block mb-1">Website</label>
            <input 
                type="text" 
                placeholder="https://example.com" 
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                {...register("website", {
                    pattern : {
                        value : /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
                        message: 'Enter a valide URL'
                    }
                })}
            />
            {errors.website && (
                <p className="text-red-500 text-sm">{String(errors.website.message)}</p>
            )}

            <label className="text-gray-700 block mb-1">Category <span className="text-red-500">*</span></label>
            <select 
            className="w-full p-2 border border-gray-300 outline-0 rounded-[4px]"
            {...register("category", {
                required: 'Category is required'
            })}
            >
            <option value="">Select a Category</option>
            {categories.map((category) => (
                <option value={category.value} key={category.value}>
                {category.label}
                </option>
            ))}
            </select>

            {errors.category && (
                <p className="text-red-500 text-sm">{String(errors.category.message)}</p>
            )}

            <button 
                type="submit"
                disabled={shopCreateMutation.isPending}
                className="w-full mt-4 text-lg cursor-pointer bg-blue-600 text-white py-2 rounded-lg"
            >
                {shopCreateMutation.isPending ? " Creating Shop ... "  : " Create Shop "}
            </button>

            {shopCreateMutation.isError && (
                shopCreateMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                    {shopCreateMutation.error.response?.data?.message || shopCreateMutation.error.message}
                    </p>
                )
            )}
        </form>
    </div>
  )
}

export default CreateShop