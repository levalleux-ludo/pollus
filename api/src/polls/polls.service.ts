import { Poll } from '../model/Poll';
import { Voter } from '../model/Voter';
import { TorusID } from '../users/TorusID';
import { UserData } from '../users/UserData';
import { votus } from '../web3/votus';

const DAY_TO_MILLISEC = 24 * 60 * 60 * 1000;
const defaultPollDuration = 1 * DAY_TO_MILLISEC; // convert in milliseconds

class PollsService {
  private _pollsPerId: Map<number, Poll> = new Map<number, Poll>();
  public async getPolls(): Promise<Poll[]> {
    // return fake_polls;
    return Array.from(this._pollsPerId.values());
  }
  public async createPoll(question: string, users: TorusID[]): Promise<number> {
    // create Poll object in datamodel
    const voters = users.map((user: TorusID) => new Voter(user));
    const poll = new Poll(
      question,
      new Date(Date.now() + defaultPollDuration),
      voters
    );
    // create the poll in smart contract
    let creationTx = await votus.createPoll(poll.pollId);
    console.log(
      'new poll created with id',
      poll.pollId,
      '(',
      question,
      voters,
      ')',
      'tx',
      creationTx
    );
    poll.creationTx = creationTx;
    // record the new poll object
    this._pollsPerId.set(poll.pollId, poll);

    return poll.pollId;
  }
  public async addProposition(pollId: number, proposition: string) {
    const poll = this._pollsPerId.get(pollId);
    if (!poll) {
      console.error('Unable to find poll with id', pollId);
      throw new Error('Unable to find poll with id' + pollId);
    }
    poll.addProposition(proposition);
    console.log('proposition', proposition, 'has been added to poll', pollId);
    return poll;
  }
  public async checkForPendingTokens(userData: UserData) {
    for (const poll of this._pollsPerId.values()) {
      console.log('check poll', poll.pollId);
      if (!poll.hasEnded()) {
        // look after pending tokens to transfer
        if (poll.pendingToken(userData.torusID)) {
          console.log(
            'pending token to transfer, pollId',
            poll.pollId,
            'user',
            userData.account
          );
          await this.transferPendingTokens(poll.pollId, userData.account);
          poll.removePendingToken(userData.torusID);
        }
      }
    }
  }

  private async transferPendingTokens(pollId: number, account: string) {
    await votus.mintUniqueToken(pollId, account);
  }
}

export const pollService: PollsService = new PollsService();
