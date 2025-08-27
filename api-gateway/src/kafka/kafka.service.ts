import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {

    private kafka = new Kafka({
        clientId: 'api-gateway',
        brokers: ['kafka:9092'],
    })

    private producer = this.kafka.producer();

    async onModuleInit() {
        await this.producer.connect();
        console.log('Kafka producer connected');
    }

    async emitTransaction(topic: string, payload: any) {
        await this.producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(payload)
                }
            ]
        })
    }
}
