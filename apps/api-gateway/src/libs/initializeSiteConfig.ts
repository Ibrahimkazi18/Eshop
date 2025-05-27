import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const initializeConfig = async () => {
    try {
        const existingConfig = await prisma.site_config.findFirst();

        if(!existingConfig) {
            await prisma.site_config.create({
                data : {
                    categories : [
                        "Electronics",
                        "Fashion",
                        "Sports & Fitness",
                        "Home & Kitchen",
                        "Books",
                        "Beauty & Personal Care",
                        "Toys & Games"
                    ],
                    subCategories : {
                        "Electronics": [
                            "Mobile Phones",
                            "Laptops",
                            "Tablets",
                            "Cameras",
                            "Headphones",
                            "Smart Watches",
                            "Gaming Consoles",
                            "Accessories"
                        ],
                        "Fashion": [
                            "Men's Clothing",
                            "Women's Clothing",
                            "Kid's Wear",
                            "Footwear",
                            "Watches",
                            "Bags & Wallets",
                            "Jewelry",
                            "Accessories"
                        ],
                        "Sports & Fitness": [
                            "Gym Equipment",
                            "Sportswear",
                            "Footwear",
                            "Yoga Mats",
                            "Protein & Supplements",
                            "Outdoor Gear",
                            "Bicycles"
                        ],
                        "Home & Kitchen": [
                            "Furniture",
                            "Home Decor",
                            "Cookware",
                            "Kitchen Appliances",
                            "Storage & Organization",
                            "Bedding",
                            "Lighting"
                        ],
                        "Books": [
                            "Fiction",
                            "Non-Fiction",
                            "Children's Books",
                            "Educational",
                            "Comics",
                            "Biographies",
                            "Self-Help"
                        ],
                        "Beauty & Personal Care": [
                            "Skincare",
                            "Haircare",
                            "Makeup",
                            "Fragrances",
                            "Bath & Body",
                            "Grooming Kits",
                            "Oral Care"
                        ],
                        "Toys & Games": [
                            "Action Figures",
                            "Board Games",
                            "Educational Toys",
                            "Dolls",
                            "Remote Control Toys",
                            "Puzzles",
                            "Outdoor Play"
                        ]
                    }
                }
            })
        }
    } catch (error) {
        console.error("Error initializing site configuration:", error);
    }
}

export default initializeConfig;