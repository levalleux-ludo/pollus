// Run dotenv
require('dotenv').config();
const Poll = require("./model/Poll.js").Poll;
const User = require('./model/User.js').User;
const Discord = require('discord.js');
const client = new Discord.Client();

const ludo_discordId = '567667293287350302';
const ludo_params = {
  verifier: "discord",
  verifierId: ludo_discordId
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login("NjgzMDc0Mjk2NzQyMjgxMjU4.XluCCw.8949x9GFbmNNpmNZDW6DjB1TZ4k");

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
  let poll = new Poll(question);
  let user_list = [];
  for (let member of members.values()) {
    // console.log(member);
    if (!member.user.bot) {
      poll.addUser({verifier:"discord", verifier_id:member.user.id})
      user_list.push(member.user.username)
      // let user = new User()
    }
  }
  msg.reply("I'm going to create a poll for the question [" + poll.getQuestion() + "]")
  msg.reply("Voters are :" + user_list);

  // const token = new Token(Poll.pollId)


}



