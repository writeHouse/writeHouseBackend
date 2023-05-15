import {
  Controller,
  Get,
  Req,
  Param,
  Put,
  Body,
  NotFoundException,
  BadRequestException,
  CacheTTL,
  Query,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { error } from 'console';
import { ValidateIf } from 'class-validator';
import { UsersService } from './users.service';
import { UserUpdateProfileDto } from './users.dto';
import { Web3Helper } from '../../utils/web3Helper';
import { isValidAddress } from '../../utils/utils';
import logger from '../../utils/logger';
import { WalletSignatureGuard } from '../../guards/walletSignature.guard';
import { UsersFollowsWalletDto } from './users-follows.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/:walletAddress/follow')
  async followUser(@Param('walletAddress') walletAddress: string, @Body() followingAddress: UsersFollowsWalletDto) {
    if (walletAddress === followingAddress.walletAddress) {
      throw new BadRequestException("You can't follow yourself");
    }

    const currentUser = await this.userService.findByAddress(walletAddress);
    if (!currentUser) throw new BadRequestException('user not found');

    const followingUser = await this.userService.findByAddress(followingAddress.walletAddress);
    if (!followingUser) {
      throw new BadRequestException('user not found');
    }

    const userFound = await this.userService.userFound({
      followerId: currentUser.id,
      followingId: followingUser.id,
    });

    if (userFound) {
      throw new BadRequestException('Already followed');
    }

    await this.userService.createFollow({
      followerId: currentUser.id,
      followerAddress: currentUser.walletAddress,
      followingId: followingUser.id,
      followingAddress: followingUser.walletAddress,
    });

    Promise.all([
      await this.userService.increment({ id: currentUser.id, column: 'followingCount' }),
      await this.userService.increment({ id: followingUser.id, column: 'followerCount' }),
    ]);
  }

  @Delete('/:walletAddress/unfollow')
  async unFollowUser(
    @Param('walletAddress') walletAddress: string,
    @Body()
    followingAddress: UsersFollowsWalletDto,
  ) {
    if (walletAddress === followingAddress.walletAddress) {
      throw new BadRequestException("You can't follow yourself");
    }

    const currentUser = await this.userService.findByAddress(followingAddress.walletAddress);
    if (!currentUser) {
      throw new BadRequestException('user not found');
    }

    const followingUser = await this.userService.findByAddress(walletAddress);
    if (!followingUser) {
      throw new BadRequestException('user not found');
    }

    const unfollow = await this.userService.deleteFollow({ followerId: currentUser.id, followingId: followingUser.id });

    if (!unfollow.affected) {
      throw new BadRequestException('You are not a follower of this user');
    }
    Promise.all([
      await this.userService.decrement({ id: currentUser.id, column: 'followingCount' }),
      await this.userService.decrement({ id: followingUser.id, column: 'followerCount' }),
    ]);
  }

  @Put('/profile')
  @UseGuards(WalletSignatureGuard)
  async updateProfile(@Body() userData: UserUpdateProfileDto, @Req() req) {
    const { polyglot } = req;

    const checksumAddress = Web3Helper.getAddressChecksum(userData.walletAddress);

    const foundUser = await this.userService.findByUsername(checksumAddress);

    if (
      userData.socialUrl &&
      !(
        /(?:https?:)?\/\/(?:www\.)?(?:mobile\.)?twitter\.com\/(#!\/)?[a-z0-9_./]+$/i.test(userData.socialUrl) ||
        /(?:https?:)?\/\/(?:www\.)?facebook\.com\/[a-z0-9_./]+$/i.test(userData.socialUrl) ||
        /(?:https?:)?\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/[a-z0-9_./]+$/i.test(userData.socialUrl)
      )
    ) {
      throw new BadRequestException(polyglot.t('Invalid social URL'));
    }

    if (
      userData.twitterUrl &&
      !/(?:https?:)?\/\/(?:www\.)?(?:mobile\.)?twitter\.com\/(#!\/)?[a-z0-9_./]+$/i.test(userData.twitterUrl)
    ) {
      throw new BadRequestException(polyglot.t('Invalid social URL'));
    }

    if (userData.linkedinUrl && !/(?:https?:)?\/\/(?:www\.)?linkedin\.com\/[a-z0-9_./]+$/i.test(userData.linkedinUrl)) {
      throw new BadRequestException(polyglot.t('Invalid social URL'));
    }

    if (userData.username && foundUser?.username?.toLocaleLowerCase() !== userData?.username?.toLocaleLowerCase()) {
      const newFoundUser = await this.userService.findByUsername(userData.username);

      if (newFoundUser && foundUser.walletAddress !== newFoundUser.walletAddress) {
        throw new BadRequestException(
          polyglot.t('Username is already taken: %{username} - %{address} Attempt', {
            username: userData.username,
            address: userData.walletAddress,
          }),
        );
      }
    }

    if (userData.signature) {
      delete userData.signature;
    }

    await this.userService.updateById(foundUser.id, {
      fullName: userData?.fullName || foundUser?.fullName || null,
      email: userData?.email || foundUser?.email || null,
      username: userData?.username || foundUser?.username || null,
      userBio: userData?.userBio || foundUser?.userBio || null,
      avatarUrl: userData?.avatarUrl || foundUser?.avatarUrl || null,
      avatarUrlThumbnail: userData?.avatarUrl
        ? userData?.avatarUrlThumbnail || null
        : foundUser?.avatarUrlThumbnail || null,
      coverUrl: userData?.coverUrl ? userData?.coverUrl || null : foundUser?.coverUrl || null,
      coverUrlThumbnail: userData?.coverUrlThumbnail
        ? userData?.coverUrlThumbnail || null
        : foundUser?.coverUrlThumbnail || null,
      socialUrl: userData?.socialUrl || foundUser?.socialUrl || null,
      twitterUrl: userData?.twitterUrl !== undefined ? userData?.twitterUrl : foundUser?.twitterUrl,
      linkedinUrl: userData?.linkedinUrl !== undefined ? userData?.linkedinUrl : foundUser?.linkedinUrl,
      username_search: (userData?.username || foundUser?.username)?.toLowerCase(),
      fullName_search: (userData?.walletAddress || foundUser?.walletAddress)?.toLowerCase(),
      keywords_search: (userData?.walletAddress || foundUser?.walletAddress)?.toLowerCase(),
    });

    return {
      statusCode: 200,
    };
  }

  @Get('/')
  async fetchAllUsers(@Query() { limit = 30, page = 1 }: { limit: number; page: number }) {
    return await this.userService.findUsersPerPage({ limit, page });
  }

  @Get('/:username/check-username')
  @CacheTTL(60 * 10)
  async checkUsernameAvailability(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    return {
      statusCode: 200,
      taken: !!user,
      username,
    };
  }

  @Get('/:addressOrUsername/check')
  async checkUser(@Param('addressOrUsername') addressOrUsername: string, @Req() req) {
    const user = await this.userService.findByAddressOrUsername(addressOrUsername);
    const { polyglot } = req;
    if (!user) {
      throw new NotFoundException(
        polyglot.t(`Could not find user with specified wallet address: ${addressOrUsername}`, {
          address: addressOrUsername,
        }),
      );
    }

    return {
      user,
    };
  }

  @CacheTTL(60)
  @Get('/:addressOrUsername')
  async getOne(@Param('addressOrUsername') addressOrUsername: string, @Req() req) {
    const { polyglot } = req;

    let user = await this.userService.findByAddressOrUsername(addressOrUsername);

    if (!user) {
      if (isValidAddress(addressOrUsername)) {
        user = await this.userService.saveNewUser({
          avatarUrl: '',
          userBio: '',
          username: '',
          walletAddress: addressOrUsername,
          keywords_search: addressOrUsername.toLowerCase(),
        });

        logger.info('Newly registered user', user);

        return {
          user,
        };
      }
      throw new NotFoundException(
        polyglot.t(`Could not find user with specified wallet address: ${addressOrUsername}`, {
          address: addressOrUsername,
        }),
      );
    }

    return {
      user,
    };
  }
}
