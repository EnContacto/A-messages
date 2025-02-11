const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "clustercfg.postreactions.26el58.use1.cache.amazonaws.com",
    port: process.env.REDIS_PORT || 6379
  }
});

redisClient.on("error", (err) => console.error("Redis error:", err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
