
import "server-only";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN harus dikonfigurasi."
  );
}

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

export const aiGenerationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "creativeflow:ai-generation",
  analytics: false,
});
