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

    if (!name || !email || !cpf || !password) {
      return reply.status(400).send({
        success: false,
        message: "All fields are required.",
      });
    }

    const customerService = new CreateCustomerService();

    try {
      const customer = await customerService.execute({
        name,
        email,
        cpf,
        password,
      });

      return reply.status(201).send({
        success: true,
        customer,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Error creating customer. Please try again.",
      });
    }
  }
}
