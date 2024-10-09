import prismaClient from "../prisma";
import { CognitoService } from "./CognitoService";

interface LoginProps {
  email: string;
  password: string;
}

export class LoginService {
  async execute({ email, password }: LoginProps) {
    const cognitoService = new CognitoService();

    const customer = await prismaClient.customer.findFirst({
      where: {
        email,
      },
    });

    if (!customer) {
      throw new Error("Esse email não existe");
    }

    return await cognitoService.login(email, password);
  }
}
