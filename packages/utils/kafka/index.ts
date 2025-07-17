import { Kafka } from "kafkajs"

export const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["pkc-921jm.us-east-2.aws.confluent.cloud:9092"],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_API_KEY!,
        password: process.env.KAFKA_API_SECRET!,
    },
    connectionTimeout: 3000,
    requestTimeout: 6000,
});