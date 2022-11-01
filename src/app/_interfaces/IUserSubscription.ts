import { UserModel } from "../models/user.model";

export interface IUserSubscription {
  id:number;
  subscription_period:string;
  subscription_name:string;
  subscription_type:string;
  subscription_price:number;
  user_name:string;
  pay_day:Date;
  status:string;
  created:Date;

}
