import {FastifyRequest, FastifyReply} from "fastify"
import { LoginService } from "../services/LoginService";


export class LoginController {
    async handle(request:FastifyRequest, reply:FastifyReply) {
        const loginService = new LoginService();

        const { email, password } = request.body as {
            email: string;
            password: string;
          };

        const customers = await loginService.execute({email, password})

        reply.send(customers)

    }
}