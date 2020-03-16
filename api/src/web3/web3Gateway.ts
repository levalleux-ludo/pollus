import fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
declare var window: any;

const networks: any = {
  development: {
    provider: () => new Web3.providers.HttpProvider('http://localhost:8545'),
    network_id: 5777,
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
  },
};

export const web3js = new Web3();

export class Web3Gateway {
  private _initialized: boolean = false;
  private _network: any;
  private _networkId: string = '';
  private _accounts: string[] = [];
  constructor(private _networkLabel: string) {
    if (!networks.hasOwnProperty(this._networkLabel)) {
      throw new Error(`Unable to find configuration for network '${this._networkLabel}'`)
    }
    this._network = networks[this._networkLabel];
    if (!this._network.hasOwnProperty('network_id')) {
      throw new Error(`Unable to find 'network_id' field if configuration for network '${this._networkLabel}'`)
    }
    this._networkId = this._network.network_id;

    if (!web3js) {
      throw Error('unable to instanciate web3');
    }

  }

  public async init(): Promise<boolean> {
    if (this._initialized) {
      return true;
    }

    try {
      // Create and set web3 provider
      const provider = this._network.provider();
      web3js.setProvider(provider);

      // Wait for the provider being connected
      return web3js.eth.net.isListening().then((isConnected: boolean) => {
        if (!isConnected) {
          throw Error(
            `web3 not initialized (network:${this._networkLabel}). Please check networks configuration`
          );
        }
        console.log('Web3 Provider is now connected !');

        // Get accounts
        return web3js.eth.getAccounts().then((ret: string[]) => {
          this._accounts = ret;
          console.log('Accounts', this._accounts);

          this._initialized = true;
          return true;
        });
      });
    } catch (err) {
      throw new Error('Fail to initialize web3 provider for network:' + this._network)
    }
  }

  public get initialized() {
    return this._initialized;
  }

  public get accounts(): string[] {
    return this._accounts;
  }

  public get networkId(): string {
    return this._networkId;
  }

  public async getBalance(address: string): Promise<string> {
    return web3js.eth.getBalance(address);
  }

  public getContract(contractABI: any, contractBuildFileJSON: any): any {
    if (!contractBuildFileJSON.networks[this._networkId]) {
      throw new Error(`contract build file does not contains definition for network with id '${this._networkId}'`);
    }
    // Extract contract address from truffle build file
    const contractAddress = contractBuildFileJSON.networks[this._networkId].address;
    return new web3js.eth.Contract(
        contractABI,
        contractAddress
      );
  }

  public async sendTransaction(
    from: string,
    to: string,
    value: number
  ): Promise<string> {
    return web3js.eth.sendTransaction(
      {
        from,
        to,
        value,
      }
    );
  }
}

export const web3Gateway = new Web3Gateway(process.env.NETWORK || 'development');
