import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AllConfigType } from '../config/config.type';
import { MailService } from '../mail/mail.service';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const { token, tokenExpires } = await this.signJWT({
      id: user._id,
      role: user.employmentInformation.role,
    });

    return {
      token,
      tokenExpires,
      user,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    await this.usersService.create({
      ...dto,
      employmentInformation: {
        role: RoleEnum.USER,
        status: StatusEnum.INACTIVE,
      },
    });

    // const { token } = await this.signJWT({
    //   id: user.id,
    //   role: user.role,
    // });

    // await this.mailService.userSignUp({
    //   to: dto.email,
    //   data: {
    //     token,
    //   },
    // });
  }

  // async confirmEmail(hash: string): Promise<void> {
  //   let userId: User['id'];

  //   try {
  //     const jwtData = await this.jwtService.verifyAsync<{
  //       confirmEmailUserId: User['id'];
  //     }>(hash, {
  //       secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
  //         infer: true,
  //       }),
  //     });

  //     userId = jwtData.confirmEmailUserId;
  //   } catch {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         hash: `invalidHash`,
  //       },
  //     });
  //   }

  //   const user = await this.usersService.findById(userId);

  //   if (!user || user?.status !== StatusEnum.inactive) {
  //     throw new NotFoundException({
  //       status: HttpStatus.NOT_FOUND,
  //       error: `notFound`,
  //     });
  //   }

  //   user.status = StatusEnum.active;

  //   await this.usersService.update(user.id, user);
  // }

  // async confirmNewEmail(hash: string): Promise<void> {
  //   let userId: User['id'];
  //   let newEmail: User['email'];

  //   try {
  //     const jwtData = await this.jwtService.verifyAsync<{
  //       confirmEmailUserId: User['id'];
  //       newEmail: User['email'];
  //     }>(hash, {
  //       secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
  //         infer: true,
  //       }),
  //     });

  //     userId = jwtData.confirmEmailUserId;
  //     newEmail = jwtData.newEmail;
  //   } catch {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         hash: `invalidHash`,
  //       },
  //     });
  //   }

  //   const user = await this.usersService.findById(userId);

  //   if (!user) {
  //     throw new NotFoundException({
  //       status: HttpStatus.NOT_FOUND,
  //       error: `notFound`,
  //     });
  //   }

  //   user.email = newEmail;
  //   user.status = StatusEnum.active;

  //   await this.usersService.update(user.id, user);
  // }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailNotExists',
        },
      });
    }

    const tokenExpiresIn = this.configService.getOrThrow('auth.forgotExpires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
        expiresIn: tokenExpiresIn,
      },
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
        tokenExpires,
      },
    });
  }

  // TODO: Revisit this
  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: string;

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: string;
      }>(hash, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `notFound`,
        },
      });
    }

    user.password = password;

    await this.usersService.update(user.id, user);
  }

  async me(id: string) {
    return await this.usersService.findById(id);
  }

  // async update(
  //   userJwtPayload: JwtPayloadType,
  //   userDto: AuthUpdateDto,
  // ) {
  //   const currentUser = await this.usersService.findById(userJwtPayload.id);

  //   if (!currentUser) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         user: 'userNotFound',
  //       },
  //     });
  //   }

  //   if (userDto.password) {
  //     if (!userDto.oldPassword) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: {
  //           oldPassword: 'missingOldPassword',
  //         },
  //       });
  //     }

  //     if (!currentUser.password) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: {
  //           oldPassword: 'incorrectOldPassword',
  //         },
  //       });
  //     }

  //     const isValidOldPassword = await bcrypt.compare(
  //       userDto.oldPassword,
  //       currentUser.password,
  //     );

  //     if (!isValidOldPassword) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: {
  //           oldPassword: 'incorrectOldPassword',
  //         },
  //       });
  //     }
  //   }

  //   if (userDto.email && userDto.email !== currentUser.email) {
  //     const userByEmail = await this.usersService.findByEmail(userDto.email);

  //     if (userByEmail && userByEmail.id !== currentUser.id) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: {
  //           email: 'emailExists',
  //         },
  //       });
  //     }

  //     const hash = await this.jwtService.signAsync(
  //       {
  //         confirmEmailUserId: currentUser.id,
  //         newEmail: userDto.email,
  //       },
  //       {
  //         secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
  //           infer: true,
  //         }),
  //         expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
  //           infer: true,
  //         }),
  //       },
  //     );

  //     await this.mailService.confirmNewEmail({
  //       to: userDto.email,
  //       data: {
  //         hash,
  //       },
  //     });
  //   }

  //   delete userDto.email;
  //   delete userDto.oldPassword;

  //   await this.usersService.update(userJwtPayload.id, userDto);

  //   return this.usersService.findById(userJwtPayload.id);
  // }

  async softDelete(id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  private async signJWT(data: { id: string; role: string }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const token = await this.jwtService.signAsync(
      {
        id: data.id,
        role: data.role,
      },
      {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      },
    );

    return {
      token,
      tokenExpires,
    };
  }
}
