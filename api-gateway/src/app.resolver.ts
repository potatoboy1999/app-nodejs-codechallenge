import { Args, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { KafkaService } from "./kafka/kafka.service";
import { CreateTransactionInput } from "./transaction/dto/create-transaction.input";

@ObjectType()
class HelloResponse {
    @Field()
    message: string;
}

@Resolver(() => HelloResponse)
export class AppResolver {

    constructor(
        private readonly kafkaService: KafkaService,
    ) {}

    @Query(() => HelloResponse)
    hello(): HelloResponse {
        return { message: "Hello World from api gateway via graphql!" };
    }

    @Mutation(() => Boolean)
    async createTransaction(
        @Args('input') input: CreateTransactionInput
    ): Promise<boolean> {
        await this.kafkaService.emitTransaction(
            'createTransaction', 
            {
                accountExternalIdDebit: input.accountExternalIdDebit,
                accountExternalIdCredit: input.accountExternalIdCredit,
                tranferTypeId: input.tranferTypeId,
                value: input.value,
            }
        );
        return true;
    }
}