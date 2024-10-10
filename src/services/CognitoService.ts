import { CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";
import logger from "../utils/logger"; // Ajuste o caminho conforme necessário
import { assumeRoleCredentialsByRoleArn } from "./sts.role-assumption";
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

export class CognitoService {
  cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({
    region: process.env.COGNITO_REGION,
  });

  async createNewAccount(
    email: string,
    cpf: string,
    password: string,
    name: string
  ) {
    const userPoolData = await this.getUserPool();
    const userPool = new CognitoUserPool(userPoolData);
    const attributeList: CognitoUserAttribute[] = [];

    attributeList.push(
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      })
    );

    if (cpf) {
      attributeList.push(
        new CognitoUserAttribute({
          Name: "custom:cpf",
          Value: cpf,
        })
      );
    }

    if (name) {
      attributeList.push(
        new CognitoUserAttribute({
          Name: "name",
          Value: name,
        })
      );
    }

    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          logger.error("Error creating new account:", { error: err }); // Usando logger para erro
          reject(err);
        } else {
          logger.info("Account created successfully for:", { email }); // Usando logger para sucesso
          const cognitoUser = result?.user;
          resolve(cognitoUser);
        }
      });
    });
  }

  async login(username: string, password: string): Promise<any> {
    const userPoolData = await this.getUserPool();
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData);

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(
        new AmazonCognitoIdentity.AuthenticationDetails({
          Username: username,
          Password: password,
        }),
        {
          onSuccess: (result: CognitoUserSession) => {
            const idToken = result.getIdToken().getJwtToken();
            const accessToken = result.getAccessToken().getJwtToken();
            const refreshToken = result.getRefreshToken().getToken();

            logger.info("Login successful for:", { username }); // Usando logger para sucesso
            resolve({
              idToken: idToken,
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          },
          onFailure: (err: any) => {
            logger.error("Error during login:", { error: err }); // Usando logger para erro
            reject(err);
          },
        }
      );
    });
  }

  async deleteUser(username: string) {
    return new Promise((resolve, reject) => {
      this.cognitoServiceProvider.adminDeleteUser(
        {
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Username: username,
        },
        function (err: any, result: {}) {
          if (err) {
            logger.error("Error deleting user:", { username, error: err }); // Usando logger para erro
            reject(err);
          } else {
            logger.info("User deleted successfully:", { username }); // Usando logger para sucesso
            resolve(result);
          }
        }
      );
    });
  }

  async getUserPool(): Promise<any> {
    return {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
    };
  }
}
