import prismaClient from "../prisma";
import logger from "../utils/logger";
import { CognitoService } from "./CognitoService";

interface DeleteCustomerProps {
  id: string;
}

export class DeleteCustomerService {
  async execute({ id }: DeleteCustomerProps) {
    const cognitoService = new CognitoService();

    try {
      logger.info(`Starting the deletion process for customer with ID: ${id}`);

      const findCustomer = await prismaClient.customer.findFirst({
        where: { id },
      });

      if (!findCustomer) {
        logger.warn(`Customer with ID: ${id} does not exist`);
        throw new Error("Client does not exist");
      }

      await prismaClient.customer.delete({
        where: { id: findCustomer.id },
      });
      logger.info(
        `Customer with ID: ${id} successfully deleted from the database`
      );

      await cognitoService.deleteUser(findCustomer.email);
      logger.info(
        `User with email: ${findCustomer.email} successfully deleted from Cognito`
      );

      return "User removed successfully";
    } catch (error) {
      logger.error(`Error occurred while deleting customer: ${error}`);
      throw error; 
    }
  }
}
