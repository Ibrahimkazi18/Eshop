import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";

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

    await redis.set(otpRequestKey, otpRequestKey+1, "EX", 3600);  // Tracking request and increment by one
}

export const sendOtp = async (name: string, email: string, template:string) => {
    const otp = crypto.randomInt(1000, 9999).toString();

    // sending email to user conataining the otp
    await sendEmail(email, "Verify Your Email", template, {name, otp});

    // setting the otp in upstash redis database with email and expiration with exipry of 5 minutes
    await redis.set(`otp:${email}`, otp, "EX", 300);  //300 seconds 
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);   // 1 minute cooldown for new otp
}
