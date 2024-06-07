import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe
} from '@nestjs/common'

function createSwagger(app: NestFastifyApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nirrora-City API')
    .addBearerAuth()
    .setDescription('API for the Mirrora-City')
    .addBearerAuth()
    .setVersion('1')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, swaggerDocument)
}

function addPipes(app: NestFastifyApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new HttpException(
          {
            statusCode: 422,
            message:
              validationErrors.length > 0
                ? Object.values(validationErrors[0].constraints).join(', ')
                : 'Unprocessable Entity',
            errors: validationErrors.map((error) => ({
              field: error.property,
              error: Object.values(error.constraints).join(', ')
            }))
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    })
  )
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, {
    cors: {
      origin: '*'
    }
  })

  createSwagger(app)
  addPipes(app)
  await app.listen(3077)
}

bootstrap()
