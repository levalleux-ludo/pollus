// Run dotenv
require('dotenv').config();
const uuid = require('uuid');

const ludo_discordId = '567667293287350302';
const ludo_params = {
  verifier: "discord",
  verifierId: ludo_discordId
}

const TorusJs=require('@toruslabs/torus.js');
// const NodeDetailManager=require('@toruslabs/fetch-node-details');

const torusJs = new TorusJs()
// const nodeDetailManager = new NodeDetailManager()

class Poll {
  constructor(question) {
    this.question = question;
    this.pollId = uuid();
    console.log("create a poll with id", this.pollId)
  }
  getQuestion() {
    return this.question;
  }
}
class Token {
  constructor(pollId) {
    this.pollId = pollId;
  }
  transfer(ethAddress) {

  }
}
class User {
  constructor(torus_id) {
    this.torus_id = torus_id;
  }
  addTokenToTransfer(token) {
    this.tokenToTransfer.push(token);
  }
  getTokenToTransfer() {
    return this.tokenToTransfer.pop();
  }
  getEthAddress() {
    return "0x000000000"
  }
}
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

const commands = {
  create_poll: '!Pollus_create:'
}
client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    } else     if (msg.content === 'pong') {
        msg.reply('ping');
      } else if (msg.content.startsWith(commands.create_poll)) {
        create_poll(msg);
      }
  
  });

function create_poll(msg) {
  let question = msg.content.substring(commands.create_poll.length).trim();
  let members = msg.guild.members;
  let user_list = [];
  for (let member of members.values()) {
    console.log(member);
    if (!member.user.bot) {
      user_list.push(member.user.username)
      let user = new User()
    }
  }
  let poll = new Poll(question);
  msg.reply("I'm going to create a poll for the question [" + poll.getQuestion() + "]")
  msg.reply("Voters are :" + user_list);

  const token = new Token(Poll.pollId)


}



