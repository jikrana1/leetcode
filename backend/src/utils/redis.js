// import { createClient } from 'redis';


// export const redisClient = createClient({
//   username: 'default',
//   password: 'FRLlD6OLbxHVgAhrsvYrI4Ywi4lnJOPk',
//   socket: {
//     host: 'redis-18035.crce292.ap-south-1-2.ec2.cloud.redislabs.com',
//     port: 18035
//   }
// });
// export const connectRedis = async () => {
//   try {
//     await redisClient.connect();
//     console.log('✅ Redis connected');
//   } catch (error) {
//     console.log('❌ Redis connection failed:', error);

//   }
// }




import { createClient } from "redis";

export const redisClient = createClient({
  username: "default",
  password: "FRLlD6OLbxHVgAhrsvYrI4Ywi4lnJOPk",
  socket: {
    host: "redis-18035.crce292.ap-south-1-2.ec2.cloud.redislabs.com",
    port: 18035,
    reconnectStrategy: (retries) => {
      console.log("Redis reconnect attempt:", retries);

      if (retries > 10) {
        return new Error("Redis max retries reached");
      }

      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("ready", () => {
  console.log("🚀 Redis ready");
});

redisClient.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});

redisClient.on("end", () => {
  console.log("⚠️ Redis connection closed");
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log("❌ Redis connection failed:", error);
  }
};