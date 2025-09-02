import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    sub: string;    
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
){

    // receber o token

    const authToken = req.headers.authorization;

    if(!authToken){
        res.status(401).end();
    }

    const [, token] = authToken.split(" ")


    try{
        // Validar o token
        const { sub } = verify(
            token,
            process.env.JWT_SECRET
        ) as Payload;

        // recuperar o id do token e colocar dentro de uma variável user_id dentro do Request
        req.user_id = sub;

        next();

        // console.log(sub);
    } catch (err) {
        res.status(401).end();
    };

}

    