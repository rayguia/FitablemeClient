export class UserModel {

  constructor(
    public UserId: string,
    public Email: string,
    public UserName: string,
    public Gender: string,
    public Photo: string,
    public TimeZone: string,
    public Password: string,
    public Token: string,
    public RefreshToken: string,
    public IsDeleted: boolean,
    public IsLocked: boolean,
    public Online: Boolean,
    public Commission: boolean,
    public Featured: boolean,
    public AcceptedTerms: boolean,
    public EmailValidated: boolean,
    public Role: number,
    public Priority: number,
  ) {
  }
}
