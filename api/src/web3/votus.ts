import fs = require('fs');
import { v4 as uuid } from 'uuid';
const Web3 = require('web3');
declare var window: any;

// import Web3 from 'web3';
// tslint:disable-next-line: no-implicit-dependencies
// import Providers = require('web3-core');
// tslint:disable-next-line: no-implicit-dependencies
// import { HttpProvider } from 'web3-providers-http';
import { randomUintMax } from '../_utils/random';

const network = 'ropsten';
const contractAddress = {
  ropsten: '0x53Ba440d5D9fD81a175ab7AA805008310C9B5f82',
};
const contractABI = JSON.parse(
  fs.readFileSync('../token/build/contracts/Votus.json', 'utf8')
).abi;

function generateNewTokenId(): number {
  return randomUintMax();
}

const web3js = new Web3();
web3js.setProvider(
  new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/98deea4ad3754e4498b9f7a454ca2b59'
  )
);

const contract = new web3js.eth.Contract(contractABI, contractAddress[network]);

class Votus {
  public mintUniqueToken(pollId: number, to: string) {
    let tokenId = generateNewTokenId();
    throw new Error('not implemented');
  }

  public async tokenExists(tokenId: number): Promise<boolean> {
    console.log('calling Votus contract');
    return contract.methods
      .exists(tokenId)
      .call()
      .then((exists: boolean) => {
        // tslint:disable-next-line: no-console
        console.log(`tokenExists(${tokenId}) -> `, exists);
        return exists;
      });
  }
}

export const votus = new Votus();
