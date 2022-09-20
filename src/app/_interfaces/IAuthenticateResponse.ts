import { UserModel } from "../models/user.model";

export interface IAuthResponse {
  success: string;
  token: string;
  refreshToken: string;
  user:UserModel;
}
