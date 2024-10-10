import {
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";
import logger from "../utils/logger";
import { assumeRoleCredentialsByRoleArn } from "./sts.role-assumption";
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

export class CognitoService {
  cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({
    region: process.env.COGNITO_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
          logger.error("Error creating new account:", { error: err });
          reject(err);
        } else {
          logger.info("Account created successfully for:", { email });
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

            logger.info("Login successful for:", { username }); 
            resolve({
              idToken: idToken,
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          },
          onFailure: (err: any) => {
            logger.error("Error during login:", { error: err }); 
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
            logger.error("Error deleting user:", { username, error: err });
            reject(err);
          } else {
            logger.info("User deleted successfully:", { username });
            resolve(result);
          }
        }
      );
    });
  }

  async adminConfirmAccount(username: string): Promise<any> {
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: username,
    };

    return new Promise((resolve, reject) => {
      this.cognitoServiceProvider.adminConfirmSignUp(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async checkAndConfirmUser(username: string) {
    try {
      const userData = await this.cognitoServiceProvider.adminGetUser({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: username,
      }).promise();
  
      if (userData.UserStatus === "CONFIRMED") {
        logger.info(`User ${username} is already confirmed.`);
        return { success: true, message: "User is already confirmed." };
      }
  
      await this.adminConfirmAccount(username);
      return { success: true, message: "User confirmed successfully." };
  
    } catch (error) {
      logger.error(`Error confirming user ${username}:`, error);
      throw new Error(`Error confirming user: ${error}`);
    }
  }

  async searchUser(username: string): Promise<boolean> {
    try {
      const cognitoReturn = await this.cognitoServiceProvider
        .listUsers({
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Filter: `email = "${username}"`,
          Limit: 1,
        })
        .promise();

      return !!(cognitoReturn.Users && cognitoReturn.Users.length > 0);
    } catch (error) {
      logger.error("Error fetching user:", error);
      return false;
    }
  }

  async getUserPool(): Promise<any> {
    return {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
    };
  }
}
