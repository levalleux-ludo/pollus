import { Poll } from '../model/Poll';
import { Voter } from '../model/Voter';
import { pollService } from '../polls/polls.service';
import { UserData } from './UserData';
import { eTorusVerifier } from './TorusID';

export const fake_users = [
  new Voter({ verifier: eTorusVerifier.discord, verifierId: 'zlkj' }),
  new Voter({ verifier: eTorusVerifier.discord, verifierId: 'ddv' }),
  new Voter({ verifier: eTorusVerifier.discord, verifierId: 'sdv' }),
  new Voter({ verifier: eTorusVerifier.discord, verifierId: 'sdf' }),
];

class UserService {
  public async login(userData: UserData) {
    // tslint:disable-next-line: no-console
    console.log(`UserService:login: ${userData}`);
    // get all polls
    let polls = await pollService.getPolls();
    polls.forEach((poll: Poll) => {
      if (!poll.hasEnded) {
        // look after pending tokens to transfer
        if (poll.pendingToken(userData.torusID)) {
          poll.removePendingToken(userData.torusID);
        }
      }
    });
  }
}
export const userService = new UserService();
