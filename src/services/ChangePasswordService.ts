import prismaClient from "../prisma";
import { formatEmail } from "../utils/functions.commons";
import logger from "../utils/logger";
import { CognitoService } from "./CognitoService";

interface ChangePasswordProps {
  email: string;
  newPassword: string;
}

export class ChangePasswordService {
  async execute({ email, newPassword }: ChangePasswordProps) {
    const cognitoService = new CognitoService();
    const formattedEmail = await formatEmail(email);

    try {
      logger.info("Changing password for user...");

      const changePassword = await cognitoService.adminChangePassword(
        formattedEmail,
        newPassword
      );

      logger.info("Password changed successfully.");
      return changePassword;
    } catch (error) {
      logger.error(
        `Error changing password: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Unable to change password.");
    }
  }
}
