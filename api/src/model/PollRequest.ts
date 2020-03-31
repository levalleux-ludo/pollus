import { Voter } from './Voter';

export class PollRequest {
  private _propositions: string[] = [];
  constructor(
    private _pollId: number,
    private _question: string,
    private _expirationDate: Date,
    private _voters: Voter[]
  ) {}

  public get pollId(): number {
    return this._pollId;
  }

  public get question(): string {
    return this._question;
  }

  public get expirationDate(): Date {
    return this._expirationDate;
  }

  public get propositions(): string[] {
    return this._propositions;
  }

  public get voters(): Voter[] {
    return this._voters;
  }
}
