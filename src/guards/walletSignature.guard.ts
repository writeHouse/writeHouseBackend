import 'dotenv/config';
import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Web3Helper } from '../utils/web3Helper';
import { UsersRepository } from '../modules/users/users.repository';
import { logger } from '../utils/logger';
import { validateWalletSignature } from '../utils/validateWalletSignature';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class WalletSignatureGuard implements CanActivate {
  constructor(private reflector: Reflector, private userRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [req] = context.getArgs();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const signature = req.body.signature || req.headers.signature;
    const walletAddress = req.body.walletAddress || Web3Helper.getAddressChecksum(req.headers.address as string);
    const data = req.body;
    if (!signature) {
      return false;
    }

    if (
      !(await validateWalletSignature({
        signature,
        walletAddress,
        data,
        validateTimestamp: true,
      }))
    ) {
      logger.error('signature failed', {
        data,
      });
      return false;
    }

    const foundUser = await this.userRepository.findOne({
      relations: ['userRoles', 'userRoles.role'],
      where: {
        walletAddress,
      },
    });

    if (!foundUser) {
      logger.error('user not found', {
        data,
      });
      return false;
    }

    if (roles?.length > 0 && !foundUser.userRoles.some((role) => roles.includes(role?.role?.name))) {
      logger.error('wrong role access', {
        data,
        roles,
      });
      return false;
    }

    logger.info({ data });
    return true;
  }
}
