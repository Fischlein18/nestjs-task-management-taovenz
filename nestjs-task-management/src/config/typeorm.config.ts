import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

interface DatabaseConfig {
    type: 'postgres';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
}

const dbConfig: DatabaseConfig = config.get('db')
// const dbConfig: DatabaseConfig = {
//     type: config.get('db.type'),
//     host: config.get('db.host'),
//     port: config.get('db.port'),
//     username: config.get('db.username'),
//     password: config.get('db.password'),
//     database: config.get('db.database'),
//     synchronize: config.get('db.synchronize')
// }

console.log(dbConfig)

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: parseInt(process.env.DB_PORT) || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE || dbConfig.database,
  //entities: [__dirname + '/../**/*.entity.ts'],
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  autoLoadEntities: true,
  synchronize: dbConfig.synchronize,
};

// export const typeOrmConfig: TypeOrmModuleOptions = {
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'postgres',
//     password: 'postgres',
//     database: 'taskmanagement',
//     //entities: [__dirname + '/../**/*.entity.ts'],
//     autoLoadEntities: true,
//     synchronize: true,
//   };
  
