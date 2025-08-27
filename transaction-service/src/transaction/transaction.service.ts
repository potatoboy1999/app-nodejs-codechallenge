import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaProducerService } from 'src/kafka/kafka.producer.service';
import { Transaction } from './entities/transaction.entity';
import { RedisService } from 'src/redis/redis.service';
import { TransactionType } from './enums/transaction-type.enum';
import { TransactionStatus } from './enums/transaction-status.enum';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly kafkaProducer: KafkaProducerService,
    private readonly redisService: RedisService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepo.create({
      transaction_external_id: createTransactionDto.accountExternalIdCredit || createTransactionDto.accountExternalIdDebit,
      transaction_type: createTransactionDto.accountExternalIdCredit ? TransactionType.CREDIT : TransactionType.DEBIT,
      tranfer_type_id: createTransactionDto.tranferTypeId,
      value: createTransactionDto.value,
    });
    const savedTransaction = await this.transactionRepo.save(transaction);

    await this.kafkaProducer.emit('transaction.created', {
      id: savedTransaction.id,
      transaction_external_id: savedTransaction.transaction_external_id,
      transaction_type: savedTransaction.transaction_type,
      tranfer_type_id: savedTransaction.tranfer_type_id,
      value: savedTransaction.value,
      status: savedTransaction.status,
      createdAt: savedTransaction.createdAt,
    })
    await this.redisService.set(`transaction:${savedTransaction.id}`, JSON.stringify(savedTransaction), 3600);
    console.log('Transaction saved and message sent to Kafka:', savedTransaction);
    return savedTransaction;
  }

  async updateStatus(id: string, status: TransactionStatus) {
    const transaction = await this.transactionRepo.findOne({ where: { id } });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.status = status;
    const updatedTransaction = await this.transactionRepo.save(transaction);
    await this.redisService.set(`transaction:${updatedTransaction.id}`, JSON.stringify(updatedTransaction), 3600);
    console.log('Transaction status updated:', updatedTransaction);
    return updatedTransaction;
  }
}
