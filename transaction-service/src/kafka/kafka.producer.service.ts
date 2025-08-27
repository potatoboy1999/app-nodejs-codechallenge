import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs";

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: any;

    async onModuleInit() {
        this.kafka = new Kafka({
            clientId: 'transaction-producer',
            brokers: ['kafka:9092'],
        });

        this.producer = this.kafka.producer();
        await this.producer.connect();
        console.log('✅ Transaction-Service: Kafka producer connected');
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }

    async emit(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }
}