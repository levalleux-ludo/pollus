import express = require('express');
import { votus } from '../web3/votus';
import { pollService } from './polls.service';

export const pollController: express.Router = express.Router();

pollController.get('/', getAll);
pollController.get('/:pollId', getFromId); // ONLY FOR TESTING PURPOSE, FOR NOW
pollController.post('/create', createPoll);
pollController.post('/:pollId/proposition', addProposition);

function getAll(req: express.Request, res: express.Response) {
  pollService
    .getPolls()
    .then(polls => res.json(polls))
    .catch(err => {
      res.status(500).send(err);
      // tslint:disable-next-line: no-console
      console.error(err);
      return;
    });
}

function getFromId(req: express.Request, res: express.Response) {
  // ONLY FOR TESTING PURPOSE, FOR NOW
  votus
    .tokenExists(+req.params.pollId)
    .then(exists => {
      res.json(exists);
    })
    .catch((err: any) => console.error(err));
}

function createPoll(req: express.Request, res: express.Response) {
  const question = req.body.question;
  if (!question) {
    res.json({ message: "Request body must define 'question' field" });
    res.sendStatus(400); // bad request
  }
  const users = req.body.users;
  if (!users) {
    res
      .status(400)
      .json({ message: "Request body must define 'users' fields" });
    return;
  }

  if (!Array.isArray(users)) {
    res.status(400).json({
      message: "Request body field 'users' must be an array",
      current: users,
    });
    return;
  }
  pollService
    .createPoll(question, users)
    .then(pollId => res.json(pollId))
    .catch(err => {
      res.status(500).send(err);
      // tslint:disable-next-line: no-console
      console.error(err);
      return;
    });
}

function addProposition(req: express.Request, res: express.Response) {
  const proposition = req.body.proposition;
  if (!proposition) {
    res
      .status(400)
      .json({ message: "Request body must define 'proposition' field" });
    return;
  }
  pollService
    .addProposition(+req.params.pollId, proposition)
    .then(poll => res.json(poll))
    .catch(err => {
      res.status(500).send(err);
      // tslint:disable-next-line: no-console
      console.error(err);
      return;
    });
}
