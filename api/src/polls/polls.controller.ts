import express = require('express');
import { votus } from '../web3/votus';
import { pollService } from './polls.service';

export const pollController: express.Router = express.Router();

pollController.get('/', getAll);
pollController.get('/:pollId', getFromId);

function getAll(req: express.Request, res: express.Response) {
  pollService
    .getPolls()
    .then(polls => res.json(polls))
    .catch(err => {
      res.send(err);
      // tslint:disable-next-line: no-console
      console.error(err);
      res.sendStatus(500);
    });
}

function getFromId(req: express.Request, res: express.Response) {
  votus
    .tokenExists(+req.params.pollId)
    .then(exists => {
      res.json(exists);
    })
    .catch((err: any) => console.error(err));
}
