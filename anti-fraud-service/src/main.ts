import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, 
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'anti-fraud-service',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'anti-fraud-consumer-group',
        }
      }
    }
  );
  await app.listen();
  console.log('✅ Anti-Fraud Service is listening for Kafka messages');
}
bootstrap();
