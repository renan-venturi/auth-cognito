import prismaClient from "../prisma";
import logger from "../utils/logger";

export class ListCustomerService {
  async execute() {
    try {
      logger.info("Fetching list of customers...");

      const customers = await prismaClient.customer.findMany();

      logger.info(`Fetched ${customers.length} customers.`);

      return customers;
    } catch (error) {
      logger.error(
        `Error fetching customers: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Unable to fetch customers.");
    }
  }
}
