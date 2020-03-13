# POLL.US
## Trustless Polling App for Social Groups on Social Networks

![Poll.us Logo](./pollus.png)

### Architecture

![Architecure overview](./architecture.png)

### Smart Contract
deployed on Ropsten at 0x53Ba440d5D9fD81a175ab7AA805008310C9B5f82
![Smart Contract on Ropsten](./Votus_smart_contract_Ropsten.png)

### Illustrations

On Discord group, invoking the Poll.Us Bot:
![Discord Bot create a poll](./discord_bot_createPoll.png)

On Voting app, just a few moment later, after login with Torus
![Poll Example](./poll_example.png)

### Get Started

#### Bot (Discord)

#### Backend

##### Build

```console
cd api
npm run build
```

##### Start

```console
cd api
node lib/indes.js
```

##### Build and test (dev)

Run 2 consoles and enter the following commands.
As soon as a change in code is detected, the compilation is relaunched and the server takes changes into account.

```console
cd api
npm run watch
```

```console
cd api
nodemon lib/index.js
```

