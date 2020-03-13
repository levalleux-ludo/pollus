import { Poll } from '../model/Poll';
import { fake_users } from '../users/users.service';

const DAY_TO_MILLISEC = 24 * 60 * 60 * 1000;
const defaultPollDuration = 1 * DAY_TO_MILLISEC; // convert in milliseconds

const fake_polls = [
  new Poll(
    'first question',
    new Date(Date.now() + defaultPollDuration),
    fake_users
  ),
  new Poll(
    'second question',
    new Date(Date.now() + defaultPollDuration),
    fake_users
  ),
  new Poll(
    'third question',
    new Date(Date.now() + defaultPollDuration),
    fake_users
  ),
];

class PollsService {
  public async getPolls(): Promise<Poll[]> {
    return fake_polls;
  }
}

export const pollService: PollsService = new PollsService();
