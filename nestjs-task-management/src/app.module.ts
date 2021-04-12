import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),  
    TasksModule, AuthModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
