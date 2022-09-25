import { UserModel } from "./user.model";

export class AuthResultModel {

  constructor(
    public success: string,
    public data:any,
    public message:string,
    
  ) {
  }
}
