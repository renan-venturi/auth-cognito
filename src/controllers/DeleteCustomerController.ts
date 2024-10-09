import {FastifyRequest, FastifyReply} from "fastify"
import { DeleteCustomerService } from "../services/DeleteCustomerService";


export class DeleteCustomerSController{
    async handle(request:FastifyRequest, reply:FastifyReply) {
        const { id } = request.body as {id: string}
        const deleteCustomerService = new DeleteCustomerService();
        const customers = await deleteCustomerService.execute({id})

        console.log('passou por aqui???')

        reply.send(customers)

    }
}