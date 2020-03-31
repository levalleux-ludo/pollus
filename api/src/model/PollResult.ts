import { PollRequest } from './PollRequest';
import { Voter } from './Voter';

export class PollResult {
  private _voters: Voter[] = [];
  private _pollId: number;
  private _votesPerProposition: { [key: string]: number } = {};
  constructor(request: PollRequest) {
    this._pollId = request.pollId;
  }
  public get voters(): Voter[] {
    return this._voters;
  }
  public get votesPerProposition(): { [key: string]: number } {
    return this._votesPerProposition;
  }
}
