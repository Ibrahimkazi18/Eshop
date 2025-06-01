import { NotFound, ValidationError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import { NextFunction, Request, Response } from "express";


// get product categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await prisma.site_config.findFirst();

        if(!config) {
            return res.status(404).json({ message : "Categories not found"});
        }

        return res.status(200).json({
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

        return res.status(201).json({
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
            return next(new  NotFound("Discount code Not Found!"));
        }
        
        if(discount_code.sellerId !== sellerId) {
            return next(new  ValidationError("Unauthorized Access!"));
        }

        await prisma.discount_codes.delete({ where : { id : id }})

        return res.status(200).json({
            message : "Dicount code deleted succesfully!",
        })
        
    } catch (error) {
        next(error);
    }
}