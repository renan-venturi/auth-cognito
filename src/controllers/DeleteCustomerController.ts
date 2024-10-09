import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCustomerService } from "../services/DeleteCustomerService";
import logger from "../utils/logger";

export class DeleteCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.body as { id: string };
    const deleteCustomerService = new DeleteCustomerService();

    try {
      const result = await deleteCustomerService.execute({ id });

      reply.status(200).send({
        success: true,
        message: result || "Customer deleted successfully",
        customerId: id,
      });
    } catch (error) {
      logger.error(error);
      reply.status(500).send({
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        customerId: id,
      });
    }
  }
}
