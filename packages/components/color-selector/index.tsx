import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

const defaultColors = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
];

const ColorSelector = ({control, error} : any) => {
    const [customColors, setCustomColors] = useState<string[]>([]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColor] = useState("#ffffff")

    return  (
        <div className="mt-2">
            <label className="block font-semibold text-gray-300 mb-1">Colors</label>

            <Controller 
                name="colors"
                control={control}
                render={({field}) => (
                    <div className="flex gap-3 flex-wrap">
                        {[...defaultColors, ...customColors].map((color) => {
                            const isSelected = (field.value || []).includes(color);
                            const isLightColor = ["#ffffff", "#ffff00"].includes(color);

                            return (
                                <button 
                                    type="button" 
                                    key={color}
                                    onClick={() => 
                                        field.onChange(
                                            isSelected 
                                                ? field.value.filter((c:string) => c !== color) 
                                                : [...(field.value || []), color]
                                        )
                                    }
                                    className={`w-7 h-7 p-2 rounded-md my-1 flex items-center justify-center border-2 transition 
                                        ${isSelected ? 'scale-110 border-white' : 'border-transparent'}
                                        ${isLightColor ? 'border-gray-600' : ''}
                                    `}
                                    style={{backgroundColor : color}}
                                />
                            )
                        })}

                        {/* Add new color */}
                        <button 
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-800 hover:bg-gray-700 transition"
                        >
                            <Plus size={16} color="white"/>
                        </button>

                        {/* Color picker */}
                        {showColorPicker && (
                            <div className="relative flex items-center gap-2">
                                <input 
                                    type="color" 
                                    value={newColor} 
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-10 h-10 p-0 border-none cursor-pointer"
                                />

                                <button 
                                    type="button"
                                    onClick={() => {
                                        setCustomColors([...customColors, newColor]);
                                        setShowColorPicker(false);
                                    }} 
                                    className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    )
}

export default ColorSelector;