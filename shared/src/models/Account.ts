export class Account {
  constructor(
    public id: string,
    public name: string,
    public balance: number
  ) {}

  static fromJSON(json: {
    id: string;
    name: string;
    balance: number;
  }): Account {
    return new Account(
      json.id,
      json.name,
      json.balance
    );
  }
}
