"use server";

import { initKafkaProducer } from "packages/utils/kafkaProducer";

export async function sendKafkaEvent(eventData : {
    userId    ?: string,
    productId ?: string,
    shopId    ?: string,
    action    :  string,
    device    ?: string,
    country   ?: string,
    city      ?: string,
}) {
    try {
        const producer = await initKafkaProducer();

        await producer.send({
            topic: "users-events",
            messages: [{ value : JSON.stringify(eventData) }],
        });

    } catch (error) {
        console.error("Error sending kafka event:", error);
    }
};