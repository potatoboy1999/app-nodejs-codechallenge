import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    KafkaModule,
    RedisModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'transactions',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TransactionModule,
  ],
  providers: [],
})
export class AppModule {}
