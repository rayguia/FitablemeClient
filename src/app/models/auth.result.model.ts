export class AuthResultModel {

  constructor(
    public success: string,
    public token: string,
    public refreshToken: string,
  ) {
  }
}
