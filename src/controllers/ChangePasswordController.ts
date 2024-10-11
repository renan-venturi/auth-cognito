import { FastifyRequest, FastifyReply } from "fastify";
import { ChangePasswordService } from "../services/ChangePasswordService"; // ajuste o caminho se necessário

export class ChangePasswordController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, newPassword } = request.body as {
      email: string;
      newPassword: string;
    };

    if (!email || !newPassword) {
      return reply.status(400).send({
        success: false,
        message: "Both email and new password are required.",
      });
    }

    const changePasswordService = new ChangePasswordService();

    try {
      const result = await changePasswordService.execute({
        email,
        newPassword,
      });

      return reply.status(200).send({
        success: true,
        message: "Password changed successfully.",
        result,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Error changing password. Please try again.",
      });
    }
  }
}
