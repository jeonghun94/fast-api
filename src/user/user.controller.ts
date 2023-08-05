import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import e from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async findAll() {
    console.log('findAll');
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

  @Post('/event/add')
  async addEvent(
    @Body()
    body: {
      eventType: 'LEAVE' | 'DUTY';
      orderState: 'WAITING' | 'APPROVED' | 'REJECTED';
      startDate: string;
      endDate: string;
      count: number;
    },
  ) {
    console.log(body);
    const user = await this.prismaService.prisma.fastUser.findUnique({
      where: {
        id: 1,
      },
    });

    const c = user.annualCount - body.count;

    if (c < 0) {
      return {
        status: 400,
        msg: 'fail',
      };
    }

    const event = await this.prismaService.prisma.fastEvent.create({
      data: {
        type: body.eventType,
        startDate: body.startDate,
        endDate: body.endDate,
        userId: 1,
      },
    });

    if (event) {
      return {
        status: 201,
        msg: 'success',
        data: {
          event,
        },
      };
    } else {
      return {
        status: 401,
        msg: 'fail',
      };
    }
  }

  @Post('/event/cancel')
  async cancelEvent(@Body('id') id: number) {
    console.log(id);
    const event = await this.prismaService.prisma.fastEvent.findUnique({
      where: {
        id,
      },
    });

    if (event) {
      await this.prismaService.prisma.fastEvent.delete({
        where: {
          id: event.id,
        },
      });

      return {
        status: 201,
        msg: 'success',
        data: true,
      };
    } else {
      return {
        status: 400,
        msg: 'fail',
      };
    }
  }

  @Get('/event/myList')
  async getMyEventList() {
    const event = await this.prismaService.prisma.fastEvent.findMany({
      where: {
        userId: 1,
      },
      include: {
        user: {
          select: {
            username: true,
            annualCount: true,
          },
        },
      },
    });

    if (event) {
      return {
        status: 200,
        msg: 'success',
        data: event,
      };
    } else {
      return {
        status: 400,
        msg: 'fail',
      };
    }
  }

  @Get('/event/list')
  async getEventList() {
    const event = await this.prismaService.prisma.fastEvent.findMany({
      include: {
        user: {
          select: {
            username: true,
            annualCount: true,
          },
        },
      },
    });

    if (event) {
      return {
        status: 200,
        msg: 'success',
        data: event,
      };
    } else {
      return {
        status: 400,
        msg: 'fail',
      };
    }
  }
}
