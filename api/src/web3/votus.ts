import fs = require('fs');
import { v4 as uuid } from 'uuid';
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
declare var window: any;

// import Web3 from 'web3';
// tslint:disable-next-line: no-implicit-dependencies
// import Providers = require('web3-core');
// tslint:disable-next-line: no-implicit-dependencies
// import { HttpProvider } from 'web3-providers-http';
import { randomUintMax } from '../_utils/random';
import { AnyARecord } from 'dns';

const MINIMUM_BALANCE_ETH = '1';

const network = 'development';
// const network = 'ropsten';
const networks = {
  development: {
    provider: () => new Web3.providers.HttpProvider('http://localhost:8545'),
    network_id: 5777,
    contractAddress: undefined, // automatically got from ../../../token/build/contracts/Votus.json
    mnemonic: undefined, // not used
  },
  ropsten: {
    provider: () => {
      const MNEMONIC = process.env.MNEMONIC;
      if (!MNEMONIC || MNEMONIC === '') {
        throw new Error(
          '[ERROR] MNEMONIC environnement variable needs to be defined before you can deploy on testnet/mainnet using Infura'
        );
      }
      return new HDWalletProvider(
        MNEMONIC,
        'https://ropsten.infura.io/v3/98deea4ad3754e4498b9f7a454ca2b59'
      );
    },
    network_id: 3,
    contractAddress: undefined, // automatically got from ../../../token/build/contracts/Votus.json
  },
};
const contractBuildFile = JSON.parse(
  fs.readFileSync('../token/build/contracts/Votus.json', 'utf8')
);
const contractABI = contractBuildFile.abi;
if (!networks[network].contractAddress) {
  // Extract contract address from truffle build file
  networks[network].contractAddress =
    contractBuildFile.networks[networks[network].network_id].address;
} else {
  throw new Error('Unable to get contract address on network ' + network);
}
console.log('contract address', networks[network].contractAddress);

function generateNewTokenId(): number {
  return randomUintMax();
}

const web3js = new Web3();
if (!web3js) {
  throw Error('web3 not initialized');
}
try {
  web3js.setProvider(networks[network].provider());
} catch (err) {
  console.error(err);
}

console.log('web3js.currentProvider', web3js.currentProvider);

web3js.eth.net.isListening().then((isConnected: boolean) => {
  if (!isConnected) {
    throw Error(
      `web3 not initialized (network:${network}). Please check connection to ${networks[network]}`
    );
  }
});

const contract = new web3js.eth.Contract(
  contractABI,
  networks[network].contractAddress
);

let accounts: string[];
web3js.eth.getAccounts().then((ret: string[]) => {
  accounts = ret;
  console.log('accounts', accounts);

  web3js.eth
    .getBalance(networks[network].contractAddress)
    .then(async (balance: string) => {
      const minBalance = web3js.utils.toWei(MINIMUM_BALANCE_ETH, 'ether');
      console.log('Current contract balance', balance);
      if (+balance < +minBalance) {
        console.log('Need to fund the contract');
        let donator = undefined;
        for (let account of accounts) {
          const accountBalance = await web3js.eth.getBalance(account);
          console.log('account', account, 'balance', accountBalance);
          if (+accountBalance > +minBalance * 2) {
            donator = account;
            break;
          }
        }
        if (!donator) {
          throw new Error(
            'Unable to find an account with enough Ether to fund the contract'
          );
        }
        web3js.eth.sendTransaction(
          {
            from: donator,
            to: networks[network].contractAddress,
            value: +minBalance * 2,
          },
          (err: any, res: AnyARecord) => {
            if (err) {
              console.error(err);
            } else {
              console.log(res);
              console.log('Funding transaction:', res);
            }
          }
        );
      }
    });
});

class Votus {
  public async mintUniqueToken(pollId: number, to: string) {
    let tokenId = generateNewTokenId();
    // const estimatedGas = await contract.methods
    // .mintUniqueTokenTo(pollId, to, tokenId, '').estimatedGas({ from: accounts[0] })
    const estimatedGas = 300000;
    console.log(
      'calling Votus contract: method mintUniqueTokenTo. Estimated Gas:',
      estimatedGas
    );
    return contract.methods
      .mintUniqueTokenTo(pollId, to, tokenId, '')
      .send({ from: accounts[0], gas: estimatedGas })
      .then((receipt: any) => {
        // tslint:disable-next-line: no-console
        console.log('token minted and transferred to', to, 'tx', receipt.transactionHash);
        return;
      });
  }

  public async tokenExists(tokenId: number): Promise<boolean> {
    console.log('calling Votus contract: method exists');
    return contract.methods
      .exists(tokenId)
      .call()
      .then((exists: boolean) => {
        // tslint:disable-next-line: no-console
        console.log(`tokenExists(${tokenId}) -> `, exists);
        return exists;
      });
  }

  public async createPoll(pollId: number): Promise<string> {
    // const estimatedGas = await contract.methods
    // .createPoll(pollId).estimatedGas({ from: accounts[0] });
    const estimatedGas = 300000;
    // await contract.methods.createPoll(pollId).estimatedGas({ from: accounts[0] }).then(
    // (estimatedGas: number) => {
    console.log(
      'calling Votus contract: method createPoll. Estimated Gas:',
      estimatedGas
    );
    return contract.methods
      .createPoll(pollId)
      .send({ from: accounts[0], gas: estimatedGas })
      .then((receipt: any) => {
        // tslint:disable-next-line: no-console
        console.log('createPoll success, Tx', receipt.transactionHash);
        return receipt.transactionHash;
      });
    // })
  }
}

export const votus = new Votus();
