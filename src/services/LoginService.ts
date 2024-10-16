import prismaClient from "../prisma";
import { CognitoService } from "./CognitoService";
import logger from "../utils/logger";
import { formatEmail } from "../utils/functions.commons";

interface LoginProps {
  email: string;
  password: string;
}

export class LoginService {
  async execute({ email, password }: LoginProps) {
    const cognitoService = new CognitoService();
    const formattedEmail = await formatEmail(email);

    try {
      if (!formattedEmail) {
        logger.warn("Login attempt failed: Email is required.");
        throw new Error("Email is required.");
      }
      const customer = await prismaClient.customer.findFirst({
        where: {
          email: formattedEmail,
        },
      });

      if (!customer) {
        logger.warn(
          `Login attempt failed: Email not found in database - ${formattedEmail}`
        );
        throw new Error("This email does not exist.");
      }

      const searchUserCognito = await cognitoService.searchUser(formattedEmail);

      if (!searchUserCognito) {
        logger.warn(
          `Login attempt failed: Email not found in Cognito - ${formattedEmail}`
        );
        throw new Error("This email does not exist in Cognito.");
      }
      logger.info(`User ${formattedEmail} found in cognito.`);

      await cognitoService.checkAndConfirmUser(formattedEmail);
      logger.info(`User ${formattedEmail} validate in cognito.`);

      const loginResult = await cognitoService.login(formattedEmail, password);
      logger.info(`User ${formattedEmail} logged in successfully.`);

      return loginResult;
    } catch (error) {
      logger.error(
        `Error during login for email ${formattedEmail}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Login failed. Please check your credentials.");
    }
  }
}
