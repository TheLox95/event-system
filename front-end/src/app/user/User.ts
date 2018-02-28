export default class User {
  constructor(
    public username?: string,
    public firstName?: string,
    public lastName?: string,
    public readonly _id?,
    public password?: string
  ) {}
}
