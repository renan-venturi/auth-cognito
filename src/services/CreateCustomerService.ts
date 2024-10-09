import prismaClient from "../prisma";
import { CognitoService } from "./CognitoService";

interface CreateCustomerProps{
    name:string;
    email: string;
    cpf: string;
    password: string;
}

class CreateCustomerService{
    async execute({name, email, cpf, password}: CreateCustomerProps) {
        
        const cognitoService = new CognitoService();
       
        if(!name || !email) {
            throw new Error("Preencha todos os campos")
        }

        const customer = await prismaClient.customer.create({
            data:{
                name,
                email,
                cpf,
                status: true
            }
        })
        console.log('chegou ate aqui')

        await cognitoService.createNewAccount(
            email,
            cpf,
            password,
            name
            // customer.id
          );

          console.log('é para ter criado no cognito')

        return customer;
    }
}

export {CreateCustomerService};