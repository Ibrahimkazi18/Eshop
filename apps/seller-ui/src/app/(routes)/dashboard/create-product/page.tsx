"use client";

import { useQuery } from "@tanstack/react-query";
import ImagePlaceHolder from "apps/seller-ui/src/shared/components/image-placeholder";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
import { ChevronRight } from "lucide-react";
import ColorSelector from "packages/components/color-selector";
import CustomProperties from "packages/components/custom-properties";
import CustomSpecification from "packages/components/custom-specification";
import Input from "packages/components/input";
import RichTextEditor from "packages/components/rich-text-editor";
import SizeSelector from "packages/components/size-selector";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";



const CreateProduct = () => {
  const { register, control, setValue, watch, handleSubmit, formState : { errors }} = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(true);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_SEVER_URI}/product/api/get-categories`)
        return res.data;
      } catch (error) {
        console.error(error)
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  const onSubmit = (data : any) => {
    console.log(data);
  }

  const handleSaveDraft = () => {}

  const handleImageChange = (file : File | null, index : number) => {
    const updatedImages = [...images];

    updatedImages[index] = file;

    if(index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    } 

    setImages(updatedImages);
    setValue("images", updatedImages);
  }

  const handleRemoveImage = (index : number) => {
    console.log(index, "remove")
    setImages((prev) => {
      let updatedImages = [...images];

      if(index === -1) {
        updatedImages[0] = null;
      }
      else {
        updatedImages.splice(index, 1);
      }

      if(updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      return updatedImages;
    });

    setValue("images", images);
  }

  return (
    <form className="w-full mx-auto p-8 rounded-lg shadow-md text-white" onSubmit={handleSubmit(onSubmit)}>
      {/* Heading and Breadcrumbs */}
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Product
      </h2>

      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span className="">Create Product</span>
      </div>

      {/* Content Layout 40 - 60 */}
      <div className="py-4 flex w-full gap-6">
        {/* Left Side - Image upload section */}
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceHolder  
              setOpenImageModal={setOpenImageModal}
              size="750 x 850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((image, index) => (
              <ImagePlaceHolder  
                setOpenImageModal={setOpenImageModal}
                size="750 x 850"
                key={index}
                small={true}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Form Inputs */}
        <div className="md:w-[65%]">
            <div className="w-full flex gap-6">
              {/* left of form inputs */}
              <div className="w-2/4">
                <Input 
                  label="Product Title *"
                  type="text"
                  placeholder="Enter product title"
                  {...register("title", { required : "Title is required!"})}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message as string}
                  </p>
                )}

                <div className="mt-2">
                  <Input 
                    label="Product Description * (Max 150 words)"
                    type="textarea"
                    rows={7}
                    cols={10}
                    placeholder="Enter product description for quick view"
                    {...register("description", { 
                      required : "Description is required!",
                      validate : (value) => {
                        const wordCount = value.trim().split(/\s+/).length;
                        return (
                          wordCount > 150 || `Description cannot exceed 150 words (Current: ${wordCount})`
                        )
                      }
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message as string}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <Input 
                    label="Tags *"
                    placeholder="apple, flagship"
                    {...register("tags", { 
                      required : "Separate related product tags with a comma",
                    })}
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tags.message as string}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <Input 
                    label="Warranty *"
                    placeholder="1 Year / No Warranty"
                    {...register("warranty", { 
                      required : "Warranty is required",
                    })}
                  />
                  {errors.warranty && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.warranty.message as string}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <Input 
                    label="Slug *"
                    placeholder="product_slug"
                    {...register("slug", { 
                      required : "Slug is required",
                      pattern : {
                        value : /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message : 'Invalid Slug Format! Use only lowercase letters, numbers, and special characters'
                      },
                      minLength : {
                        value : 3,
                        message : 'Slug length should be atleast 3 characters.'
                      },
                      maxLength : {
                        value : 50,
                        message : 'Slug length should be maximum 50 characters.'
                      }
                    })}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.slug.message as string}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <Input 
                    label="Brand"
                    placeholder="Apple"
                    {...register("brand")}
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.brand.message as string}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <ColorSelector control={control} error={errors}/>
                </div>

                <div className="mt-2">
                  <CustomSpecification control={control} errors={errors}/>
                </div>

                <div className="mt-2">
                  <CustomProperties control={control} errors={errors}/>
                </div>

                <div className="mt-2">
                  <label className="block mb-1 text-gray-300 font-semibold">
                    Cash On Delivery *
                  </label>

                  <select 
                    {...register("cash_on_delivery", {
                      required : "Cash On Delivery is required !"
                    })}
                    defaultValue="yes"
                    className="w-full border outline-none border-gray-700 bg-transparent rounded-md px-2 py-1 overflow-hidden"
                  >
                    <option value="yes" className="bg-black">
                      Yes
                    </option>
                    <option value="no" className="bg-black">
                      No
                    </option>
                  </select>

                  {errors.cash_on_delivery && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.cash_on_delivery.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-2/4">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">
                      Category *
                    </label>

                    {
                      isLoading ? (
                        <p className="text-gray-400">
                          Loading categories...
                        </p>
                      ) : isError ? (
                        <p className="text-red-500">
                          Failed to load categories
                        </p>
                      ) : (
                        <Controller 
                          name="category"
                          control={control}
                          rules={{ required : "Category is required! "}}
                          render={({field}) => (
                            <select
                              {...field}
                              className="w-full border outline-none border-gray-700 bg-transparent py-1 px-2 rounded-md"
                            >
                              {" "}
                              <option value="" className="bg-black">
                                Select Category
                              </option>

                              { categories?.map((category : string, index : number) => (
                                <option value={category} key={index} className="bg-black">
                                  {category}
                                </option>
                              )) }
                            </select>
                          )}
                        />
                      )
                    }
                    {errors.category && (
                      <p className="text-red-500 text-sm">
                        {errors.category.message as string}
                      </p>
                    )}

                    <div className="mt-2">
                      <label className="block font-semibold text-gray-300 mb-1">
                        Subcategory *
                      </label>

                      {
                        isLoading ? (
                          <p className="text-gray-400">
                            Loading subcategories...
                          </p>
                        ) : isError ? (
                          <p className="text-red-500">
                            Failed to load subcategories
                          </p>
                        ) : (
                          <Controller 
                            name="subcategory"
                            control={control}
                            rules={{ required : "Subcategory is required! "}}
                            render={({field}) => (
                              <select
                                {...field}
                                className="w-full border outline-none border-gray-700 bg-transparent py-1 px-2 rounded-md"
                              >
                                {" "}
                                <option value="" className="bg-black">
                                  Select Subcategory
                                </option>

                                { subCategories?.map((subcategory : string, index : number) => (
                                  <option value={subcategory} key={index} className="bg-black">
                                    {subcategory}
                                  </option>
                                )) }
                              </select>
                            )}
                          />
                        )
                      }
                      {errors.subcategory && (
                        <p className="text-red-500 text-sm">
                          {errors.subcategory.message as string}
                        </p>
                      )}

                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="block text-gray-300 mb-1 font-semibold">
                      Detailed Description * (Min 100 words)
                    </label>

                    <Controller 
                      name="detailed_description"
                      control={control}
                      rules={{
                        required : "Detailed Description is required!",
                        validate : (value) => {
                          const wordCount = value?.split(/\s+/).filter((word : string) => word).length;

                          return (
                            wordCount >= 100 || `Description must be atleast 100 words! ${wordCount}/100`
                          )
                        }
                      }}
                      render={({field}) => (
                        <RichTextEditor value={field.value} onChange={field.onChange}/>
                      )}
                    />

                    {errors.detailed_description && (
                      <p className="text-red-500 text-sm">
                        {errors.detailed_description.message as string}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <Input 
                      label="Vide URL"
                      placeholder="https://www.youtube.com/embed/xyz123"
                      {...register("video_url", {
                        pattern : {
                          value : /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                          message : "Invalide YouTube URL Format! Use format: https://www.youtube.com/embed/xyz123"
                        }
                      })}
                    />

                    {errors.video_url && (
                      <p className="text-red-500 text-sm">
                        {errors.video_url.message as string}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <Input 
                      label="Regular Price"
                      placeholder="20$"
                      {...register("regular_price", {
                        valueAsNumber : true,
                        min : { value : 1, message : "Price must be atleast 1"},
                        validate : (value) => !isNaN(value) || 'Only numbers are allowed',
                      })}
                    />

                    {errors.regular_price && (
                      <p className="text-red-500 text-sm">
                        {errors.regular_price.message as string}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <Input 
                      label="Sale Price *"
                      placeholder="15$"
                      {...register("sale_price", {
                        required : "Sale price is required",
                        valueAsNumber : true,
                        min : { value : 1, message : "Price must be atleast 1"},
                        validate : (value) => {
                          if (isNaN(value)) return 'Only numbers are allowed'

                          if (regularPrice && value >= regularPrice) {
                            return "Sale Price must be less than Regular Price"
                          }

                          return true;
                        },
                      })}
                    />

                    {errors.sale_price && (
                      <p className="text-red-500 text-sm">
                        {errors.sale_price.message as string}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <Input 
                      label="Stock *"
                      placeholder="100"
                      {...register("stock", {
                        required : "Stock is required",
                        valueAsNumber : true,
                        min : { value : 1, message : "Stock must be atleast 1"},
                        max : { value : 1000, message : "Stock cannot exceed 1000"},
                        validate : (value) => {
                          if (isNaN(value)) return 'Only numbers are allowed'

                          if (!Number.isInteger(value)) {
                            return "Stock must be a whole number"
                          }

                          return true;
                        },
                      })}
                    />

                    {errors.stock && (
                      <p className="text-red-500 text-sm">
                        {errors.stock.message as string}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <SizeSelector control={control} errors={errors} />
                  </div>

                  <div className="mt-3">
                    <label className="block font-semibold text-gray-300 mb-1">
                      Select Discount Codes (optional)
                    </label>
                  </div>
              </div>
            </div>

        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        {isChanged && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          { loading ? 'Creating ... ' : 'Create'}
        </button>
      </div>
    </form>
  )
}

export default CreateProduct