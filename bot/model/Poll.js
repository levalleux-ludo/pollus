
const uuid = require('uuid');

class Poll {
    users;
    constructor(question) {
      this.question = question;
      this.pollId = uuid();
      console.log("create a poll with id", this.pollId)
    }
    getQuestion() {
      return this.question;
    }
    addUser(torus_id) {
        this.users.push(torus_id)
    }
  }

module.exports = {Poll}
