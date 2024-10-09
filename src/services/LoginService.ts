import prismaClient from "../prisma";
import { CognitoService } from "./CognitoService";
import logger from "../utils/logger";

interface LoginProps {
  email: string;
  password: string;
}

export class LoginService {
  async execute({ email, password }: LoginProps) {
    const cognitoService = new CognitoService();

    try {
      if (!email) {
        logger.warn("Login attempt failed: Email is required.");
        throw new Error("Email is required.");
      }
      const customer = await prismaClient.customer.findFirst({
        where: {
          email,
        },
      });

      if (!customer) {
        logger.warn(`Login attempt failed: Email not found - ${email}`);
        throw new Error("This email does not exist.");
      }

      const loginResult = await cognitoService.login(email, password);
      logger.info(`User ${email} logged in successfully.`);

      return loginResult;
    } catch (error) {
      logger.error(
        `Error during login for email ${email}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Login failed. Please check your credentials.");
    }
  }
}
