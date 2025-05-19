import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction, Request, Response } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";
import prisma from "@packages/libs/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const { name, email, password, phone_number, country } = data;

    if (
        !name || !email || !password || (userType === "seller" && (!phone_number || !country))
    ) {
        throw new ValidationError("Missing Required Fields!")
    }

    if (!emailRegex.test(email)) {
        throw new ValidationError("Invalid Email Format");
    }
}

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    if (await redis.get(`otp_lock:${email}`)) {
        return next(
            new ValidationError(
                "Account locked due to multiple failed attempts! Try again after 30 minutes."
            )
        );
    }
    
    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(
            new ValidationError(
                "Too many OTP requests! Please Try again after 1 hour."
            )
        );
    }
    
    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(
            new ValidationError(
                "Please wait 1 minute before requesting a new OTP."
            )
        );
    }
}

export const trackOtp = async (email: string, next: NextFunction) => { 
    const otpRequestKey = `otp_request_count:${email}`

    let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

    if(otpRequests > 2) {
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);  // Lock for 1 hour
        return next(
            new ValidationError(
                "Account locked due to multiple failed attempts! Try again after 30 minutes."
            )
        );
    }

    await redis.set(otpRequestKey, otpRequests+1, "EX", 3600);  // Tracking request and increment by one
}

export const sendOtp = async (name: string, email: string, template:string) => {
    const otp = crypto.randomInt(1000, 9999).toString();

    // sending email to user conataining the otp
    await sendEmail(email, "Verify Your Email", template, {name, otp});

    // setting the otp in upstash redis database with email and expiration with exipry of 5 minutes
    await redis.set(`otp:${email}`, otp, "EX", 300);  //300 seconds 
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);   // 1 minute cooldown for new otp
}

export const verifyOtp = async (email: string, otp: string, next:NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);

    if(!storedOtp) {
        return next(new ValidationError("Invalid or Expired OTP"));
    }

    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt(await redis.get(failedAttemptsKey) || `0`);

    if(storedOtp !== otp) {
        if(failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
            await redis.del(`otp:${email}`, failedAttemptsKey);
            return next(new ValidationError("Too many failed attempts! Now your account is locked. Please try again after 30 minutes."));
        }
        await redis.set(failedAttemptsKey, failedAttempts+1, "EX", 300);
        return next(new ValidationError(`Incorrect OTP. ${2 - failedAttempts} attempts left.`));
    }

    await redis.del(`otp:${email}`, failedAttemptsKey);
}

export const handleForgotPassword = async (req: Request, res: Response, next:NextFunction, userType: "user" | "seller") => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(new ValidationError("Email is required!"));
        }

        // user or seller in db
        const user = userType === "user" && await prisma.users.findUnique({ where : { email }});

        if(!user) {
            return next(new ValidationError(`${userType} not found.`));
        }

        // Check otp restrictions
        await checkOtpRestrictions(email, next);
        await trackOtp(email, next);
        
        // generate and send otp if all is good
        await sendOtp(user.name, email, userType === 'user' ? 'forgot-password-user-mail' : 'forgot-password-seller-mail');

        res.status(200).json({
            message: "OTP sent to email. Please verify your account."
        });


    } catch (error) {
        return next(error);
    }
}

export const verifyForgotPasswordOtp = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const {email, otp} = req.body;

        if(!email || !otp) {
            return next(new ValidationError("Email and OTP are required!"));
        }

        await verifyOtp(email, otp, next);

        res.status(200).json({
            message: "OTP verified. you can now reset your password."
        })

    } catch (error) {
        return next(error);
    }
}
