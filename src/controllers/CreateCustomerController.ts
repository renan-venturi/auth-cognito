import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";

export class CreateCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, cpf, password } = request.body as {
      name: string;
      email: string;
      cpf: string;
      password: string;
    };

    const customerService = new CreateCustomerService();
    const customer = await customerService.execute({
      name,
      email,
      cpf,
      password,
    });

    reply.send(customer);
  }
}
