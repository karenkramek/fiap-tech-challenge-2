export class Account {
  constructor(
    public id: string,
    public name: string,
    public balance: number,
    public email?: string,
    public password?: string
  ) {}

  static fromJSON(json: {
    id: string;
    name: string;
    balance: number;
    email?: string;
    password?: string;
  }): Account {
    return new Account(
      json.id,
      json.name,
      json.balance,
      json.email,
      json.password
    );
  }
}
