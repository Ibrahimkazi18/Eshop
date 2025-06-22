import prisma from "@packages/libs/prisma";
import cron from "node-cron";

cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date();

        await prisma.products.deleteMany({
            where : { isDeleted : true, deletedAt: { lte : now }},
        })

    } catch (error) {
        console.log("Error in cron job: ", error);
    }
})
