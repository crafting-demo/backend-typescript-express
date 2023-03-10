import { Kafka, Producer } from "kafkajs";

import { logger } from "../logger";

export class KafkaProducer {
  private static instance: KafkaProducer;

  private producer: Producer;

  private connected: boolean;

  public static getInstance(): KafkaProducer {
    if (!this.instance) {
      this.instance = new KafkaProducer();
    }
    return this.instance;
  }

  private constructor() {
    logger.Write("KafkaProducer: create instance");
    const kafka = new Kafka({
      brokers: [
        //`${process.env.KAFKA_SERVICE_HOST}:${process.env.KAFKA_SERVICE_PORT}`,
        "127.0.0.1:9092",
      ],
    });
    this.producer = kafka.producer();
    this.connected = false;
  }

  public async start() {
    try {
      logger.Write("KafkaProducer: connecting");
      await this.producer.connect();
      logger.Write("KafkaProducer: connected");
      this.connected = true;
    } catch (err) {
      logger.Write(`KafkaProducer: failed to connect producer: ${err}`);
    }
  }

  public async shutdown() {
    if (this.connected) {
      await this.producer.disconnect();
    }
  }

  public async enqueue(topic: string, message: string) {
    if (!this.connected) {
      await this.start();
    }
    await this.producer.send({
      topic,
      messages: [
        {
          value: message,
        },
      ],
    });
  }
}
