const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
// import * as AWS from "aws-sdk/global";
import * as AWS from "aws-sdk";
import {
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { assumeRoleCredentialsByRoleArn } from "./sts.role-assumption";


export class CognitoService {
  cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({
    region: process.env.COGNITO_REGION,
    // credentials: assumeRoleCredentialsByRoleArn(
    //   process.env.AWS_CROSS_ACCOUNT_ROLE
    // ),
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
          reject(err);
        } else {
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

            resolve({
              idToken: idToken,
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          },
          onFailure: (err: any) => {
            console.error("Erro no login:", err);
            reject(err);
          },
        }
      );
    });
  }

  // async createCognitoUser(username: string): Promise<any> {
  //   const poolData = await this.getUserPool();
  //   const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  //   const userData = {
  //     Username: username,
  //     Pool: userPool,
  //   };
  //   console.log(userData, '< -userData')
  //   return await new AmazonCognitoIdentity.CognitoUser(userData);
  // }

  // async deleteUser(username: string) {
  //   return new Promise((resolve, reject) => {
  //     this.createCognitoUser(username).then((cognitoUser) => {
  //       cognitoUser.deleteUser((err: any, result: void) => {
  //         if (err) {
  //           console.log('entrou aqui???')
  //           console.error('Erro ao remover o usuário no Cognito:', err);
  //           reject(err);
  //         }
  //         console.log(`Usuário ${username} removido com sucesso no Cognito.`);
  //         resolve(result);
  //       });
  //     });
  //   });
  // }

  async deleteUser(username: string) {
    return new Promise((resolve, reject) => {
      this.cognitoServiceProvider.adminDeleteUser(
        {
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Username: username,
        },
        function (err: any, result: {}) {
          if (err) {
            console.log(err, 'caiu no if')
            reject(err);
          }
          console.log('passou do if')
          resolve(result);
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
