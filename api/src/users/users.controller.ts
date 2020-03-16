import express = require('express');
import { v4 as uuid } from 'uuid';
import { userService } from './users.service';
import { UserData } from './UserData';

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
  // if (!req.body.user) {
  //   res.status(400).json({ message: "Request body must define 'user' field" });
  //   return;
  // }
  let user: UserData = new UserData();
  try {
    Object.assign(user, req.body);
  } catch (e) {
    console.error('invalid user structure', user, e);
    res
      .status(400)
      .json({ message: 'Request body invalid structure', current: user });
    return;
  }
  if (!user.isValid()) {
    res
      .status(400)
      .json({ message: 'Request body invalid structure', current: user });
    return;
  }
  userService
    .login(user)
    .then(poll => res.json(poll))
    .catch(err => {
      res.status(500).send(err);
      // tslint:disable-next-line: no-console
      console.error(err);
      return;
    });
}
