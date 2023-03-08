import * as ethjs from 'ethereumjs-util';

export const getSignerAddress = (hashedData: string, signature: string): string => {
  const msgBuffer = ethjs.toBuffer(hashedData);
  const msgHash = ethjs.hashPersonalMessage(msgBuffer);
  const signatureBuffer = ethjs.toBuffer(signature);
  const signatureParams = ethjs.fromRpcSig(ethjs.bufferToHex(signatureBuffer));
  const publicKey = ethjs.ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
  const addressBuffer = ethjs.publicToAddress(publicKey);
  return ethjs.bufferToHex(addressBuffer);
};
