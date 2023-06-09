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

export enum LogType {
  MINTED,
  PURCHASED,
  PRICE_UPDATED,
  LISTING_UPDATED,
  TRANSFER,
}

const mintedInputs = [
  {
    indexed: true,
    internalType: 'address',
    name: 'minterAddress',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'price',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'tokenID',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'string',
    name: 'uri',
    type: 'string',
  },
];

const purchasedInputs = [
  {
    indexed: true,
    internalType: 'address',
    name: 'previousOwner',
    type: 'address',
  },
  {
    indexed: true,
    internalType: 'address',
    name: 'newOwner',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'price',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'tokenID',
    type: 'uint256',
  },
];

const priceUpdateInputs = [
  {
    indexed: true,
    internalType: 'address',
    name: 'minterAddress',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'tokenID',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'oldPrice',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'newPrice',
    type: 'uint256',
  },
];

const listingStatusUpdateInputs = [
  {
    indexed: true,
    internalType: 'address',
    name: 'owner',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'tokenID',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'bool',
    name: 'isListed',
    type: 'bool',
  },
];

const transferInputs = [
  {
    indexed: true,
    internalType: 'address',
    name: 'from',
    type: 'address',
  },
  {
    indexed: true,
    internalType: 'address',
    name: 'to',
    type: 'address',
  },
  {
    indexed: true,
    internalType: 'uint256',
    name: 'tokenId',
    type: 'uint256',
  },
];

export class Web3Service {
  constructor(web3: Web3) {
    this.web3 = web3;
  }

  public web3: Web3;

  public decodeLog(log: any, logType: LogType) {
    let inputs;
    switch (logType) {
      case LogType.MINTED:
        inputs = mintedInputs;
        break;
      case LogType.PURCHASED:
        inputs = purchasedInputs;
        break;
      case LogType.PRICE_UPDATED:
        inputs = priceUpdateInputs;
        break;
      case LogType.LISTING_UPDATED:
        inputs = listingStatusUpdateInputs;
        break;
      case LogType.TRANSFER:
        inputs = transferInputs;
        break;
      default:
        inputs = mintedInputs;
        break;
    }
    return this.web3.eth.abi.decodeLog(inputs, log.data, log.topics.slice(1));
  }
}
