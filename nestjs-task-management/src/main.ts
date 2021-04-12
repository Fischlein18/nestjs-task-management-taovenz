import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
    const logger = new Logger('bootstrap')
    const app = await NestFactory.create(AppModule)

    if (process.env.NODE_ENV === 'development') {
        app.enableCors()
    } else {
        app.enableCors({ origin: config.get('server.origin') })
        logger.log(`Accepting requests from origin "${config.get('server.origin')}"`)
    }

    const port = process.env.PORT || config.get('server.port')
    await app.listen(port)

    logger.log(`Application listening on port ${port}`)
}
bootstrap();
