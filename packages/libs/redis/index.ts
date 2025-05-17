import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_DATABASE_URL!);

export default redis;