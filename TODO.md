# TODO List

## Votus smart contract

* being able to clear all data for a given poll or all polls (reset)
* do not donate 0.01 ETH to user if his balance is > 0

## Backend

* store backend model in database (Poll objects, at least)
* create an ETH service with (API controller) to transfer back ETH from old contract when migrate to a new contract
(example: /eth/payback?from=OLD_CONTRACT)

## Frontend

* finalize frontend look/ergonomics/responsiveness
* connect frontend to backend via API (GET polls, POST users/authenticate, POST polls/vote, GET polls/result)
* connect frontend to Votus smart contract (getNbTokens..., vote, )

## Bot (Discord)

* connect DiscordBot to backend via API (POST polls/create, POST polls/proposition)

