import { UserModel } from "../models/user.model";

export interface IUserSubscription {
  UserSubscriptionId:number;
  Price:number;
  PayDate:Date;
  SubscriptionPeriod:number;
  SubscriptionPeriodName:string;
  SubscriptionStatus:number;
  SubscriptionStatusName:string;
  SubscriptionType:number;
  SubscriptionTypeName:string;
  createdAt:Date;
  SubscriptionId:number;
  UserId:number;
  UserPhoto:string;
}