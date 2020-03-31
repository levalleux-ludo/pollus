import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
// import { pollController } from './polls/polls.controller';
// import { userController } from './users/users.controller';
import { web3Gateway } from './web3/web3Gateway';

web3Gateway.init().then((initialized: boolean) => {
  const app = express();
  const port = 8080 || process.env.PORT;

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());

  app.get('/', (req, res) => {
    res.send('Hi2!');
  });

  // api routes
  app.use('/polls', require('./polls/polls.controller'));
  app.use('/users', require('./users/users.controller'));

  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
  });
});

