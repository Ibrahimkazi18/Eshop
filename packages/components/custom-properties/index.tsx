import { Controller } from "react-hook-form"
import Input from "../input";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

const CustomProperties = ({control, errors} : any) => {
  const [properties, setProperties] = useState<{label : string, values : string[]}[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");

  return (
    <div>
        <div className="flex flex-col gap-3">
            <Controller 
                name={`custom_properties`}
                control={control}
                render={({field}) => {
                    useEffect(() => {
                        field.onChange(properties);
                    }, [properties]);

                    const addProperty = () => {
                        if(!newLabel.trim()) return;
                        
                        setProperties([...properties, { label : newLabel, values : []}])
                        setNewLabel("");
                    };

                    const addValue = (index : number) => {
                        if(!newValue.trim()) return;

                        const updatedProperties = [...properties];
                        updatedProperties[index].values.push(newValue);
                        
                        setProperties(updatedProperties);
                        setNewValue("");
                    };

                    const removeProperty = (index : number) => {
                        setProperties(properties.filter((_, i) => i !== index));
                    };

                    return (
                        <div className="mt-2">
                            <label className="block font-semibold mb-1 text-gray-300">
                                Custom Properties
                            </label>

                            <div className="flex flex-col gap-3">
                                {/* Existing Properties */}
                                {properties.map((property, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-700 bg-gray-900 rounded-lg p-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-white font-medium">
                                                {property.label}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => removeProperty(index)}
                                            >
                                                <X size={18} className="text-red-500"/>
                                            </button>
                                        </div>

                                        {/* Add values to the property */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <input 
                                                type="text" 
                                                placeholder="Enter value..."
                                                className="border p-2 border-gray-700 bg-gray-800 rounded-md outline-none text-white w-full" 
                                                value={newValue}
                                                onChange={(e) => setNewValue(e.target.value)}
                                            />

                                            <button
                                                type="button"
                                                className="px-3 py-1 text-white bg-blue-500 rounded-md"
                                                onClick={() => addValue(index)}
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {/* Show values */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {property.values.map((value, index) => (
                                                <span 
                                                    key={index}
                                                    className="px-2 py-1 text-white bg-gray-700 rounded-md text-sm"
                                                >
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Add a property */}
                                <div className="flex items-center gap-2 mt-1">
                                    <Input 
                                        placeholder="Enter a property (e.g. Size, Variants)"
                                        value={newLabel}
                                        onChange={(e : any) => setNewLabel(e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        className="px-3 py-2 text-white bg-blue-500 rounded-md flex items-center justify-center"
                                        onClick={() => addProperty()}
                                    >
                                        <Plus size={16}/> Add
                                    </button>
                                </div>
                            </div>

                            {errors.custom_properties && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.custom_properties.message as string}
                                </p>
                            )}
                        </div>
                    )
                }}
            />
        </div>
    </div>
  )
}

export default CustomProperties