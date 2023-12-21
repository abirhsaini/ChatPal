import { Injectable } from '@angular/core';
import  {Amplify ,Auth} from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { User } from './User';
import {
  ListUsersCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
 

  constructor() { 
    Amplify.configure({
      Auth: environment.cognito
    })
  }

  
  public signup(user:User) : Promise<any> {
    return Auth.signUp({
      username:user.user_email,
      password:user.user_password,
      attributes:{
        given_name:user.user_name,
        picture:user.user_photoURL,
      }

    })
    
  }

  public confirmSignUp(user: User, confirmationCode: string): Promise<any> {
    return Auth.confirmSignUp(user.user_email, confirmationCode);
  }

  /**
   * signIn
   */
  public signIn(user:User):Promise<any> {
    return Auth.signIn(user.user_email,user.user_password)
  }
  
  /**
   * getUser
   */


  /**
   * updateUser
   */
  public updateUser(user:User):Promise<any> {
    return Auth.currentUserPoolUser().then((cognitoUser:any)=>{
      return Auth.updateUserAttributes(cognitoUser,user);
    })
  }
  async fetchCurrentUser() {
    try {
      const user = await Auth.currentUserInfo()
      console.log(user.attributes.given_name
        );
      return user.attributes
    } catch (error) {
      console.error('Error fetching current user', error);
    }
  }

  async fetchUsers(): Promise<any> {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken();
      const token = accessToken.getJwtToken();
      console.log(token)
      const client = new CognitoIdentityProviderClient({
        region: environment.cognito.region,
       
      });
      const command = new ListUsersCommand({
        UserPoolId: environment.cognito.userPoolId,
      });

      const response = await client.send(command);
      return response.Users;
    } catch (error) {
      console.error('Error listing users', error);
      throw error;
    }
  }
}
