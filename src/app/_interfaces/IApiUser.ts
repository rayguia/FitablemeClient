export interface IApiUser {
  UserId: string;
  Email: string;
  UserName: string;
  Gender: string;
  Photo: string;
  TimeZone: string;
  Token: string;
  RefreshToken: string;
  IsDeleted: boolean;
  IsLocked: boolean;
  Online: Boolean;
  Commission: boolean;
  Featured: boolean;
  AcceptedTerms: boolean;
  EmailValidated: boolean;
  Role: number;
  Priority: number;
}
