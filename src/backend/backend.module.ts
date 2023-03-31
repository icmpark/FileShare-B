import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import dbConfig from './config/dbConfig';
import { DBConfigModule, DBConfigService} from './config/dbConfigModule';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import authConfig from './config/authConfig';
import { SignModule } from './sign/sign.module';
import { FileModule } from './file/file.module';
import fileConfig from './config/fileConfig';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      // envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [dbConfig, authConfig, fileConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [DBConfigModule],
      inject: [DBConfigService],
      useFactory: async (conf: DBConfigService) => ({
        uri: conf.makeMongoDBUri(),
      }),
    }),
    CacheModule.registerAsync({
      imports: [DBConfigModule],
      inject: [DBConfigService],
      useFactory: async (conf: DBConfigService) => conf.makeRedisConf(),
      isGlobal: true
    }),
    GroupModule,
    SignModule,
    FileModule
  ]
})
export class BackendModule {}
