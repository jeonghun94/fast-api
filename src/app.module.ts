import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [PrismaService],
})
export class AppModule {}
