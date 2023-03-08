import Web3 from 'web3';
import { SupportedChain } from '../../constants/shared';

export interface IWeb3InitParams {
  web3: Web3;
  chainId: number;
  marketContractAddress: string;
  deployerAddress: string;
}

export interface IWeb3InitProvider {
  getWeb3Params(providedChain: SupportedChain): IWeb3InitParams;
}
