import prismaClient from "../prisma";
import { formatEmail } from "../utils/functions.commons";
import logger from "../utils/logger";
import { CognitoService } from "./CognitoService";

interface CreateCustomerProps {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

export class CreateCustomerService {
  async execute({ name, email, cpf, password }: CreateCustomerProps) {
    const cognitoService = new CognitoService();

    try {
      if (!name || !email) {
        logger.warn("Attempt to create a customer with missing fields.");
        throw new Error("Preencha todos os campos");
      }

      const formattedEmail = await formatEmail(email)

      const customer = await prismaClient.customer.create({
        data: {
          name,
          email: formattedEmail,
          cpf,
          status: true,
        },
      });
      logger.info(`Customer created successfully: ${JSON.stringify(customer)}`);

      await cognitoService.createNewAccount(formattedEmail, cpf, password, name);
      logger.info(`Cognito account created for email: ${formattedEmail}`);

      return customer;
    } catch (error) {
      logger.error(
        `Error while creating customer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error; 
    }
  }
}
