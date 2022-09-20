import { UserModel } from "./user.model";

export class AuthResultModel {

  constructor(
    public success: string,
    public token: string,
    public refreshToken: string,
    public user:UserModel
  ) {
  }
}
