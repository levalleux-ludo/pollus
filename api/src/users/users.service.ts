import { Poll } from '../model/Poll';
import { Voter } from '../model/Voter';
import { pollService } from '../polls/polls.service';
import { eTorusVerifier } from './TorusID';
import { UserData } from './UserData';

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
    await pollService.checkForPendingTokens(userData);
  }
}
export const userService = new UserService();
