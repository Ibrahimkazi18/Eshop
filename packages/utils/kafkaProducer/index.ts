import { Partitioners } from "kafkajs";
import { kafka } from "packages/utils/kafka";

export const producer = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.LegacyPartitioner,
});

let connected = false;

export async function initKafkaProducer() {
  if (!connected) {
    await producer.connect();
    connected = true;
  }
  return producer;
}