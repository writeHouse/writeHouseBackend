import 'dotenv/config';
import Web3 from 'web3';

export interface WebInitParams {
  web3: Web3;
}

function initWeb3Instance(): WebInitParams {
  if (process.env.NODE_ENV !== 'production') {
    const nodeUrl = process.env.WEB3_NODE_RPC_DEV as string;
    const web3 = new Web3(nodeUrl);
    return {
      web3,
    };
  }

  const nodeUrl = process.env.WEB3_NODE_RPC as string;
  const web3 = new Web3(nodeUrl);
  return {
    web3,
  };
}

export class Web3Helper {
  private static lazyInit: WebInitParams;

  public static getWeb3(): WebInitParams {
    Web3Helper.lazyInit = Web3Helper.lazyInit || initWeb3Instance();
    return Web3Helper.lazyInit;
  }

  public static getAddressChecksum(address: string): string {
    return this.getWeb3().web3.utils.toChecksumAddress(address);
  }
}
