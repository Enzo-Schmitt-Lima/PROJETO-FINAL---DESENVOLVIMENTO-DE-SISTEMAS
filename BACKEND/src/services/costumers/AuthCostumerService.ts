import prismaClient from "../../../prisma";
import { compare } from "bcryptjs"
import { sign } from 'jsonwebtoken'

interface AuthCostumerRequest {
    email: string;
    password: string;   
}

class AuthCostumerService {
    async execute({ email, password}: AuthCostumerRequest) {

        const costumer = await prismaClient.costumer.findFirst({
            where:{
                email: email
            }
        })

        if(!costumer){
            throw new Error("User/password incorrect")
        }

        const passwordMatch = await compare(password, costumer.password)

        if(!passwordMatch){
            throw new Error("User/password incorrect")

        }

        const token = sign(
            {
                id: costumer.id,
                name:  costumer.name,
                email: costumer.email
            },
            process.env.JWT_SECRET,
            {
                subject: costumer.id,
                expiresIn: '30d'
            }

        )
        
        return{
            id: costumer.id,
            name: costumer.name,
            email: costumer.email,
            token: token
        }
    }
}

export { AuthCostumerService };