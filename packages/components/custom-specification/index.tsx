import { Controller, useFieldArray } from "react-hook-form"
import Input from "../input";
import { PlusCircle, Trash2 } from "lucide-react";

const CustomSpecification = ({control, errors} : any) => {
  const {fields, append, remove} = useFieldArray({
    control,
    name: "custom_specifications"
  });

  return (
    <div>
        <label className="block font-semibold text-gray-300 mb-1">
            Custom Specifications
        </label>

        <div className="flex flex-col gap-3">
            {fields?.map((item, index) => (
                <div
                    key={index}
                    className="flex gap-2 items-center"
                >
                    <Controller 
                        name={`custom_specifications.${index}.name`}
                        control={control}
                        rules={{required : "Specification name is required!"}}
                        render={({field}) => (
                            <Input 
                                label="Specification Name"
                                placeholder="eg. Battery Life, Weight, Material"
                                {...field}
                            />
                        )}
                    />

                    <Controller 
                        name={`custom_specifications.${index}.value`}
                        control={control}
                        rules={{required : "Specification value is required!"}}
                        render={({field}) => (
                            <Input 
                                label="Specification Value"
                                placeholder="eg. 6000mAH, 1.1Kg, Titanium"
                                {...field}
                            />
                        )}
                    />

                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 size={20}/>
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => append({ name: "", value: "" })}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
                <PlusCircle size={20}/> Add Specification
            </button>
        </div>

        {errors.custom_specifications && (
            <p className="text-red-500 text-sm mt-2">
                {errors.custom_specifications.message as string}
            </p>
        )}
    </div>
  )
}

export default CustomSpecification