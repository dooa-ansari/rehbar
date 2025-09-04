import { RateLimiterMemory } from "rate-limiter-flexible"

export const rateLimiter = new RateLimiterMemory({
  points: 5, 
  duration: 60, 
})
