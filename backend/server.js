import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import { connectRedis} from "./src/utils/redis.js";
// import dotenv from "dotenv";

// dotenv.config();
const port = process.env.PORT || 3001;
app.listen(port, async () => {
  await connectDB();
await connectRedis();
  console.log("server start at PORT : ", port);
})