import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import { pollController } from './polls/polls.controller';
import { userController } from './users/users.controller';

const app = express();
const port = 8080 || process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hi2!');
});

// api routes
app.use('/polls', pollController);
app.use('/users', userController);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
