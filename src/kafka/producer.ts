import { Kafka, Message, Producer } from "kafkajs";

import { logger } from "../logger";

export class ProducerFactory {
  private producer: Producer;

  private brokers: string[];

  constructor(brokers?: string[]) {
    this.brokers = brokers || [
      `${process.env.KAFKA_SERVICE_HOST}:${process.env.KAFKA_SERVICE_PORT}`,
    ];
    this.producer = this.createProducer();
  }

  public async start() {
    try {
      await this.producer.connect();
    } catch (err) {
      logger.Writef("ProducerFactory", "failed to connect producer", err);
    }
  }

  public async shutdown() {
    await this.producer.disconnect();
  }

  public async enqueue(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: message,
        },
      ],
    });
  }

  public async enqueueBatch(topic: string, messages: string[]) {
    const kafkaMessages: Message[] = messages.map((msg) => ({
      value: msg,
    }));

    await this.producer.sendBatch({
      topicMessages: [
        {
          topic,
          messages: kafkaMessages,
        },
      ],
    });
  }

  private createProducer(): Producer {
    const kafka = new Kafka({
      brokers: this.brokers,
    });

    return kafka.producer();
  }
}
