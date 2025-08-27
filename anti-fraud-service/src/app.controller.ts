import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionCreatedPayload } from './interface/transaction-created-payload';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction.created')
  async handleTransactionCreated(
    @Payload() payload: any
  ) {
    const transaction: TransactionCreatedPayload = payload;
    console.log('📥 [Anti-Fraud] Received transaction.created:', transaction);

    const decision = await this.appService.evaluateTransaction(transaction);
    console.log('📤 [Anti-Fraud] Decision:', decision);

    await this.appService.emitStatusUpdate(transaction.id, decision);
  }
}
