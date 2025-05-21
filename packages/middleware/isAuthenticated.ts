import prisma from "@packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken"

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message : "Unauthorized! Token missing."
            })
        }

        // Verifying the token
        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET as string
        )  as { id : string, role : "user" | "seller"};

        if (!decoded || !decoded.id || !decoded.role) {
            return res.status(401).json({
                message : "Unauthorized! Invalid Token."
            })
        }

        let account;

        if (decoded.role === "user") {
            account = await prisma.users.findUnique({ where : { id : decoded.id }});
        }

        if(!account) {
            return res.status(401).json({
                message : "Account Not Found."
            })
        };

        req.user = account;

        return next();

    } catch (error) {
        return res.status(401).json({
            message : "Unauthorized! Token Expired or Invalid."
        });
    }
}

export default isAuthenticated;