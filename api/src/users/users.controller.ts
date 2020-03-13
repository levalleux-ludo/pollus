import express = require('express');
import { v4 as uuid } from 'uuid';

export const userController = express.Router();

userController.get('/', getAll);
userController.post('/authenticate', authenticate);

function getAll(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.json({});
}

function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.json({});
}
