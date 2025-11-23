import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    sub: string;    
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
): void { // <-- middleware retorna void
    const authToken = req.headers.authorization;

    // Log header for debugging token issues (dev only).
    try {
        console.log('isAuthenticated: Authorization header:', authToken);
    } catch (e) {}

    if(!authToken){
        // return explicit JSON so frontend can log a clearer message
        res.status(401).json({ error: 'Authorization header missing' });
        return;
    }

    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, process.env.JWT_SECRET!) as Payload;

        req.user_id = sub;

        next();
    } catch (err: any) {
        // Log verification error to backend console for debugging
        try { console.log('isAuthenticated verify error:', err.message || err); } catch (e) {}
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
}
