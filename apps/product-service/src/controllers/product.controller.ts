import { AuthError, NotFound, ValidationError } from "@packages/error-handler";
import imagekit from "@packages/libs/imagekit";
import prisma from "@packages/libs/prisma";
import { NextFunction, Request, Response } from "express";


// get product categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await prisma.site_config.findFirst();

        if(!config) {
            res.status(404).json({ message : "Categories not found"});
            return
        }

        res.status(200).json({
            categories : config.categories,
            subCategories : config.subCategories,
        })
        
    } catch (error) {
        next(error);
    }
}


// create discounts
export const createDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { public_name, discountType, discountValue, discountCode } = req.body;

        const isDiscountCodeExist = await prisma.discount_codes.findUnique({ where : {discountCode : discountCode}})

        if(isDiscountCodeExist) {
            return next(new ValidationError("Discount Code Already Exists, Please USe a Different Code"));
        }

        const discount_code = await prisma.discount_codes.create({
            data : {
                public_name,
                discountCode,
                discountType,
                discountValue : parseFloat(discountValue),
                sellerId: req.seller.id
            }
        })

        return res.status(200).json({
            success : true,
            discount_code
        })
        
    } catch (error) {
        next(error);
    }
}


// fetch discounts
export const getDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const discount_code = await prisma.discount_codes.findMany({ where : {  sellerId : req.seller.id }});

        res.status(201).json({
            success : true,
            discount_code
        })
        
    } catch (error) {
        next(error);
    }
}


// delete discounts
export const deleteDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const sellerId = req.seller?.id;


        const discount_code = await prisma.discount_codes.findUnique({ 
            where : {  id : id },
            select : { id : true, sellerId : true }
        });

        if(!discount_code){
            next(new  NotFound("Discount code Not Found!"));
            return;
        }
        
        if(discount_code.sellerId !== sellerId) {
            next(new  ValidationError("Unauthorized Access!"));
            return;
        }

        await prisma.discount_codes.delete({ where : { id : id }})

        res.status(200).json({
            message : "Dicount code deleted succesfully!",
        })
        
    } catch (error) {
        next(error);
    }
}


// uploading image to cloud
export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileName } = req.body;

        if(!fileName) {
            throw new ValidationError("File required.")
        }

        const response = await imagekit.upload({
            file : fileName,
            fileName : `product-${Date.now()}.jpg`,
            folder: "/products"
        })

        res.status(201).json({
            file_url : response.url,
            file_id : response.fileId,
        })

    } catch (error) {
        next(error);
    }
}

// delete image from cloud
export const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileId } = req.body;

        if(!fileId) {
            throw new ValidationError("File required.")
        }

        const response = await imagekit.deleteFile(fileId);

        res.status(201).json({
            success : true,
            response
        })

    } catch (error) {
        next(error);
    }
}


// create product 
export const createProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            description,
            detailed_description,
            custom_specifications,
            warranty,
            slug,
            tags,
            cash_on_delivery,
            brand,
            video_url,
            category,
            colors = [],
            sizes = [],
            discountCodes,
            stock,
            sale_price,
            regular_price,
            subcategory,
            custom_properties = {},
            images = [],
        } = req.body;

        console.log(req.body);

        if(!title || !description || !slug || !sale_price || !cash_on_delivery || !regular_price || !stock || !category || !subcategory || !images) {
            return next(new  ValidationError("Missing some required fileds!"));
        }

        if(!req.seller.id) {
            return next(new  AuthError("Only seller can create products!"));
        }

        const slugChecking = await prisma.products.findUnique({where : { slug }});

        if(slugChecking) {
            return next(new  ValidationError("Slug already exists! Please use a different slug!"));
        }

        const newProduct = await prisma.products.create({
            data : {
                title,
                short_descirption : description,
                slug,
                detailed_description,
                tags : Array.isArray(tags) ? tags : tags.split(","),
                brand,
                warranty,
                custom_properties: custom_properties || {},
                custom_specification: custom_specifications || {},
                category,
                subCategory: subcategory,
                sale_price: parseFloat(sale_price),
                regular_price: parseFloat(regular_price),
                video_url,
                colors: colors || [],
                sizes: sizes || [],
                stock: parseInt(stock),
                discount_codes: discountCodes.map((codeId:string) => codeId),
                cash_on_delivery,
                shopId : req.seller?.shop?.id!,
                images : {
                    create : images
                            .filter((img : any) => img && img.fileId && img.fileUrl)
                            .map((image:any) => ({
                                file_id : image.fileId,
                                url : image.fileUrl,
                            })),
                }
            },
            include : {
                images : true
            }
        })

        res.status(201).json({
            success : true,
            newProduct
        });

    } catch (error) {
        next(error);
    }
}

// get products
export const getShopProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const shopId = req.seller?.shop?.id;

        if(!shopId) {
            next(new ValidationError("Shop not found!"));
            return;
        }

        const products = await prisma.products.findMany({
            where : {
                shopId: shopId,
            },
            include : {
                images : true,
            }
        })

        res.status(201).json({
            success : true,
            products
        });

    } catch (error) {
        next(error);
    }
}

// delete product
export const deleteProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        
        const product = await prisma.products.findUnique({
            where : {id : productId},
            select : { id: true, shopId :true, isDeleted: true}
        })

        if(!product) {
            next(new NotFound("Product not found!"));
            return;
        }

        if(product.shopId !== req.seller?.shop?.id) {
            next(new ValidationError("Unauthorized Access!"));
            return;
        }

        if(product.isDeleted) {
            next(new ValidationError("Product is already deleted!"));
            return;
        }

        const deletedProduct = await prisma.products.update({
            where : { id  :productId },
            data : {
                isDeleted : true,
                deletedAt : new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours later
            }
        })

        res.status(201).json({
            message : "Product is scheduled for deletion in 24 hours. You can restore it within this time.",
            deletedAt: deletedProduct.deletedAt,
        });
        
    } catch (error) {
        next(error);
    }
}

// restore product
export const restoreProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        
        const product = await prisma.products.findUnique({
            where : {id : productId},
            select : { id: true, shopId :true, isDeleted: true}
        })

        if(!product) {
            next(new NotFound("Product not found!"));
            return;
        }

        if(product.shopId !== req.seller?.shop?.id) {
            next(new ValidationError("Unauthorized Access!"));
            return;
        }

        if(!product.isDeleted) {
            next(new ValidationError("Product is not in deleted state!"));
            return;
        }

        await prisma.products.update({
            where : { id  :productId },
            data : {
                isDeleted : false,
                deletedAt : null
            }
        });

        res.status(201).json({
            message : "Product successfully restored.",
        });
        
    } catch (error) {
        next(error);
    }
}