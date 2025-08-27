import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { StatusUpdatePayload } from './dto/status-update-payload.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('createTransaction')
  create(@Payload() createTransactionDto: CreateTransactionDto) {
     console.log('📥 [transaction-service] Received:', createTransactionDto);
    return this.transactionService.create(createTransactionDto);
  }

  @MessagePattern('transaction.status.update')
  async handleStatusUpdate(
    @Payload() payload: any,
  ): Promise<void> {
    const data: StatusUpdatePayload = payload.value ? JSON.parse(payload.value) : payload;
    console.log('📥 [transaction-service] Received status update:', data);

    await this.transactionService.updateStatus(
      data.id,
      data.status
    );
    console.log(`✅ Transaction ${data.id} updated to status=${data.status}`);
  }
}
