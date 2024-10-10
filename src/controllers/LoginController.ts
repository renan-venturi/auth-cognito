import { FastifyRequest, FastifyReply } from "fastify";
import { LoginService } from "../services/LoginService";

export class LoginController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const loginService = new LoginService();

    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    try {
      if (!email || !password) {
        return reply.status(400).send({
          success: false,
          message: "Email and password are required.",
        });
      }

      const customer = await loginService.execute({ email, password });

      if (!customer) {
        return reply.status(401).send({
          success: false,
          message: "Invalid credentials.",
        });
      }

      return reply.status(200).send({
        success: true,
        customer,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
}
