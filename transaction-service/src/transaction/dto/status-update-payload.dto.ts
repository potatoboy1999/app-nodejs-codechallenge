import { TransactionStatus } from "../enums/transaction-status.enum";

export interface StatusUpdatePayload {
    id: string;
    status: TransactionStatus;
}