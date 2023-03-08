import 'dotenv/config';
import Web3 from 'web3';
import { SupportedChain } from '../../constants/shared';
import { IWeb3InitProvider, IWeb3InitParams } from './config.web3.provider';
import { chainConfigLoader } from './chain.config.loader';

enum ChainKey {
  BscMainnet = 'bsc_mainnet',
  BscTestnet = 'bsc_testnet',
}

type ChainKeyOptions = {
  [key in ChainKey]?: IWeb3InitParams;
};
export class Web3Config implements IWeb3InitProvider {
  private static cachedWeb3Params: ChainKeyOptions = {};

  public getWeb3Params(chain: SupportedChain): IWeb3InitParams {
    const network = process.env.NODE_ENV !== 'production' ? 'testnet' : 'mainnet';
    const chainNetwork = `${chain}_${network}`;

    if (Web3Config.cachedWeb3Params.hasOwnProperty(chainNetwork)) {
      return Web3Config.cachedWeb3Params[chainNetwork];
    }
    const newlyInitChainParams = this.getInternalWeb3Params(chain);
    Web3Config.cachedWeb3Params[chainNetwork] = newlyInitChainParams;
    return newlyInitChainParams;
  }

  private getInternalWeb3Params(chain: SupportedChain): IWeb3InitParams {
    switch (chain) {
      case SupportedChain.BINANCE: {
        const { binance } = chainConfigLoader();
        return this.initWeb3Params(binance);
      }

      default:
        throw new TypeError(`Unsupported chain  was provided ${chain}`);
    }
  }

  private initWeb3Params(chainConfig: any): IWeb3InitParams {
    if (process.env.NODE_ENV !== 'production') {
      const chainId = chainConfig.testnet.chainIdDev;
      const marketContractAddress = chainConfig.testnet.marketContractAddressDev;
      const deployerAddress = chainConfig.testnet.deployerAddressDev;
      const nodeUrl = chainConfig.testnet.web3NodeRpcDev;
      const web3 = new Web3(nodeUrl);

      return {
        web3,
        chainId,
        marketContractAddress,
        deployerAddress,
      };
    }

    const { chainId } = chainConfig.mainnet;
    const { marketContractAddress } = chainConfig.mainnet;
    const { deployerAddress } = chainConfig.mainnet;
    const nodeUrl = chainConfig.mainnet.web3NodeRpc;
    const web3 = new Web3(nodeUrl);

    return {
      web3,
      chainId,
      marketContractAddress,
      deployerAddress,
    };
  }
}
