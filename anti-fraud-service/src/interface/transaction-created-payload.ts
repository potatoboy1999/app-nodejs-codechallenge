export interface TransactionCreatedPayload {
    id: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status: string;
    createdAt: string;
}