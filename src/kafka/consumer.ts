import {
  Consumer,
  ConsumerSubscribeTopic,
  EachBatchPayload,
  EachMessagePayload,
  Kafka,
} from "kafkajs";

import { ServiceType } from "common/types";
import { logger } from "logger";

export class ConsumerFactory {
  private consumer: Consumer;

  private brokers: string[];

  constructor(brokers?: string[]) {
    this.brokers = brokers || [
      `${process.env.KAFKA_SERVICE_HOST}:${process.env.KAFKA_SERVICE_PORT}`,
    ];
    this.consumer = this.createConsumer();
  }

  public async start(topic: string, onCallback: (message: string) => void) {
    const consumerTopic: ConsumerSubscribeTopic = {
      topic,
      fromBeginning: false,
    };

    try {
      await this.consumer.connect();
      await this.consumer.subscribe(consumerTopic);

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          const { message } = payload;
          onCallback(JSON.stringify(message.value));
        },
      });
    } catch (err) {
      logger.write("ConsumerFactory", "failed to consume topic", err);
    }
  }

  public async startBatch(
    topic: string,
    onCallback: (message: string) => void
  ) {
    const consumerTopic: ConsumerSubscribeTopic = {
      topic,
      fromBeginning: false,
    };

    try {
      await this.consumer.connect();
      await this.consumer.subscribe(consumerTopic);

      await this.consumer.run({
        eachBatch: async (payload: EachBatchPayload) => {
          const { batch } = payload;

          batch.messages.forEach((message) => {
            onCallback(JSON.stringify(message.value));
          });
        },
      });
    } catch (err) {
      logger.write("ConsumerFactory", "failed to consume topic batch", err);
    }
  }

  public async shutdown() {
    await this.consumer.disconnect();
  }

  private createConsumer() {
    const kafka = new Kafka({
      brokers: this.brokers,
    });

    return kafka.consumer({
      groupId: ServiceType.Express,
    });
  }
}
