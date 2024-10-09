import prismaClient from "../prisma";
import { CognitoService } from "./CognitoService";

interface DeleteCustomerProps{
    id: string;
}

class  DeleteCustomerService{
    async execute({id}:  DeleteCustomerProps) {
        try {
            const cognitoService = new CognitoService();
       
            // const findCustomer = await prismaClient.customer.findFirst({
            //     where: {
            //         id
            //     }
            // })
    
            // if(!findCustomer){
            //     throw new Error("Client not exist")
            // }
    
            // await prismaClient.customer.delete({
            //     where: {
            //         id: findCustomer.id
            //     }
            // })
    
            await cognitoService.deleteUser('renan@teste.com')
    
            return 'Usuario removido'
            
        } catch (error) {
            return error
        }

      
    }
}

export { DeleteCustomerService};