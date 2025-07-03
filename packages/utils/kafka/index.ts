import { Kafka } from "kafkajs"

export const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["d1iiigjuh51f8e3tlfn0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092"],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_API_KEY!,
        password: process.env.KAFKA_API_SECRET!,
    }
});