import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomerService } from "../services/ListCustomersService";

export class ListCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const listCustomerService = new ListCustomerService();

        try {
            const customers = await listCustomerService.execute();
            return reply.status(200).send(customers); 
        } catch (error) {
            return reply.status(500).send({ 
                success: false, 
                message: "Unable to retrieve customers." 
            });
        }
    }
}
