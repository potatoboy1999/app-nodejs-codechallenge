import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionCreatedPayload } from './interface/transaction-created-payload';
import { TransactionStatus } from './enums/TransactionStatus';

@Injectable()
export class AppService {
  private kafka: Kafka;
  private producer: any;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'anti-fraud-service',
      brokers: ['kafka:9092'],
    });

    this.producer = this.kafka.producer();

    this.producer = this.kafka.producer();
    this.producer
      .connect()
      .then((): void => console.log('✅ Anti-Fraud Producer connected'))
      .catch((err: Error): void => console.error('🔴 Antifraud producer error:', err));
  }

  async evaluateTransaction(transaction: TransactionCreatedPayload): Promise<TransactionStatus> {
    if(transaction.value < 1000) {
      return TransactionStatus.APPROVED
    }else {
      return TransactionStatus.REJECTED
    }
  }

  async emitStatusUpdate(id: string, newStatus: TransactionStatus): Promise<void> {
    const message = {
      id,
      status: newStatus,
    };

    await this.producer.send({
      topic: 'transaction.status.update',
      messages: [{ value: JSON.stringify(message)}],
    });
    console.log(`📤 Emitted status update for id=${id} → ${newStatus}`);
  }
}
