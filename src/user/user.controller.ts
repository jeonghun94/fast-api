import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async findAll() {
    return await this.prismaService.prisma.user.findMany();
  }

  @Post('/join')
  async create(
    @Body() body: { email: string; password: string; username: string },
  ) {
    const user = await this.prismaService.prisma.fastUser.create({
      data: {
        password: body.password,
        username: body.username,
        email: body.email,
        updatedAt: new Date(),
      },
    });

    if (user) {
      return {
        status: 201,
        msg: 'success',
      };
    } else {
      return {
        status: 401,
        msg: 'fail',
      };
    }
  }

  @Post('/email')
  async emailCheck(@Body() body: { email: string }) {
    console.log(body.email);
    const user = await this.prismaService.prisma.fastUser.findUnique({
      where: {
        email: body.email,
      },
    });

    if (user) {
      return {
        status: 200,
        msg: 'fail',
        data: {
          responseType: false,
        },
      };
    } else {
      return {
        status: 200,
        msg: 'success',
        data: {
          responseType: true,
        },
      };
    }
  }

  @Post('/login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.prismaService.prisma.fastUser.findUnique({
      where: {
        email: body.email,
        AND: {
          password: body.password,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        imageUrl: true,
      },
    });

    if (user) {
      return {
        status: 200,
        msg: 'success',
        data: {
          ...user,
          accessToken: 'dsiofjsdf987sdfji1io29823ydsf',
          refreshToken: 'fasadgsadg87sdfji1io29823ydsf',
        },
      };
    } else {
      return {
        status: 200,
        msg: 'fail',
      };
    }
  }
}
