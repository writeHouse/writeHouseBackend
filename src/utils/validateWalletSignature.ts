import dayjs from 'dayjs';
import { getSignerAddress } from './cryptographer';
import { logger } from './logger';
import { Web3Helper } from './web3Helper';
import { orderAndRemoveEmpty } from './utils';

export const validateWalletSignature = async ({
  data,
  walletAddress,
  signature,
  validateTimestamp = false,
}: {
  data: any;
  walletAddress: string;
  signature: string;
  validateTimestamp?: boolean;
}) => {
  const { web3 } = Web3Helper.getWeb3();

  const cleanedUpFields = JSON.stringify(
    orderAndRemoveEmpty({
      ...(data || {}),
      signature: undefined,
    }),
  );

  const hashedData = web3.utils.sha3(cleanedUpFields) as string;

  logger.info('Signature data:', {
    data,
    signature,
    cleanedUpFields,
    hashedData,
  });

  const signerAddress = getSignerAddress(hashedData, signature);

  if (validateTimestamp && dayjs(data?.timestamp).isBefore(dayjs().subtract(2, 'minutes').format())) {
    logger.error('Replay attack prevention - old signature submitted (More than 2 minutes)', {
      data,
      signature,
      cleanedUpFields,
      hashedData,
    });
    return false;
  }

  return (
    signerAddress.toLowerCase() === walletAddress.toLowerCase() &&
    signerAddress.toLowerCase() === data?.walletAddress?.toLowerCase()
  );
};
