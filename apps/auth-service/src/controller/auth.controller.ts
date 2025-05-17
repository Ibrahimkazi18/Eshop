import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtp, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";


// Register a new user 
export const userRegistration = async (req:Request, res:Response, next:NextFunction) => {
    try {
        validateRegistrationData(req.body, "user")
    
        const { name, email } = req.body;

        const existingUser = await prisma.users.findUnique({where: { email }})

        if(existingUser) {
            return next(new ValidationError("User already exist with this email!"));
        }

        await checkOtpRestrictions(email, next);
        await trackOtp(email, next);
        await sendOtp(name, email, "user-activation-mail");

        res.status(200).json({
            message: "OTP sent to email. Please verify your account.",
        })

    } catch (error) {
        return next(error);
    }
}


// Verify user with otp
export const verifyUser = async (req:Request, res:Response, next:NextFunction) => { 
    try {
        const { email, otp, name, password} = req.body;

        if ( !email || !otp || !name || !password ) {
            throw next(new ValidationError("All fileds are required!"));
        }

        const existingUser = await prisma.users.findUnique({where: { email }})

        if(existingUser) {
            throw next(new ValidationError("User already exist with this email!"));
        }

        await verifyOtp(email, otp, next);

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data : {
                name: name,
                email: email,
                password: hashedPassword,
            }
        })

        res.status(200).json({
            success: true,
            message: "User registered succefully!"
        })

    } catch (error) {
        throw next(error);
    }
}