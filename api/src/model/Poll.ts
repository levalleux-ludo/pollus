import { request } from 'express';
import { sha1 } from 'object-hash';
import { randomUint32 } from '../_utils/random';
import { TorusID } from '../users/TorusID';
import { PollRequest } from './PollRequest';
import { PollResult } from './PollResult';
import { Voter } from './Voter';

// class PendingTokens {

//   private hash(userTorusId: TorusID): string {
//     return sha1(userTorusId);
//   }
//   public addUser(userTorusId: TorusID) {
//     this.userMap.set(this.hash(user))
//   }
//   public hasUser(userTorusId: TorusID): boolean {
//   }
//   public removeUser(userTorusId: TorusID) {
//   }
// }

function generateNewPollId(): number {
  return randomUint32();
}

export class Poll {
  private _pollId: number;
  private _request: PollRequest;
  private _result: PollResult;
  private _hasEnded = false;
  private _pendingTokensToTransfer = new Map<string, boolean>();
  private _creationTx: string = '';
  constructor(question: string, expirationDate: Date, voters: Voter[]) {
    this._pollId = generateNewPollId();
    this._request = new PollRequest(
      this._pollId,
      question,
      expirationDate,
      voters
    );
    this._result = new PollResult(this._request);
    voters.forEach(voter => {
      const userKey = sha1(voter.torusId);
      console.log('add pending token for user', voter);
      this._pendingTokensToTransfer.set(userKey, true);
    });
  }

  public get pollId() {
    return this._pollId;
  }
  public get request(): PollRequest {
    return this._request;
  }
  public get creationTx(): string {
    return this._creationTx;
  }
  public set creationTx(value: string) {
    this._creationTx = value;
  }
  public hasEnded(): boolean {
    return this._hasEnded;
  }
  public end() {
    if (this._hasEnded) {
      return;
    }
    this._hasEnded = true;
  }
  public addProposition(proposition: string) {
    // TODO: must not accept new proposition if votes have already started
    this._request.propositions.push(proposition);
  }
  public vote(user: Voter) {
    this._result.voters.push(user);
    if (this._request.voters.length === this._result.voters.length) {
      this._hasEnded = true;
    }
  }
  public pendingToken(userTorusId: TorusID): boolean | undefined {
    const userKey = sha1(userTorusId);
    console.log('look for pending token. userKey', userKey);
    console.log(this._pendingTokensToTransfer.keys());
    console.log(this._pendingTokensToTransfer.has(userKey));
    return this._pendingTokensToTransfer.get(userKey);
  }
  public removePendingToken(userTorusId: TorusID) {
    const userKey = sha1(userTorusId);
    this._pendingTokensToTransfer.delete(userKey);
  }
}
