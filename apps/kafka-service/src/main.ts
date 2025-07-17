import * as dotenv from 'dotenv';
dotenv.config();

import { kafka } from "@packages/utils/kafka";
import { updateUserAnalytics } from "./services/analytics.service";

const consumer = kafka.consumer({groupId : "user-events-group"});

const eventQueue : any[] = [];


const processQueue = async () => {
    if(eventQueue.length === 0) return;

    const events = [...eventQueue];
    eventQueue.length = 0;

    for (const event of events) {
        if(event.action === "shop_visit") {
            // update shop analytics
        }

        const validActions = [
            "add_to_wishlist",
            "remove_from_wishlist",
            "add_to_cart",
            "remove_from_cart",
            "product_view",
        ];

        if(!event.action || !validActions.includes(event.action)) {
            continue;
        }

        try {
            await updateUserAnalytics(event);
        } catch (error) {
            console.error("Error processing event:" ,error);
        }
    }
}

setInterval(processQueue, 3000);


// kafka consumer for user events...
export const consumeKafkaMessages = async() => {
    // connect to kafka broker
    await consumer.connect();
    await consumer.subscribe({topic: "users-events", fromBeginning: false});

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) {
                return;
            }
            try {
                const event = JSON.parse(message.value.toString());
                eventQueue.push(event);
            } catch (error) {
                console.error('Error parsing Kafka message:', error);
            }
        },
    });
}

consumeKafkaMessages().catch(console.error);