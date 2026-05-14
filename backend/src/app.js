import express from "express"
import cookieParser from 'cookie-parser';
import userAuthRouter  from "./routes/user.routes.js"
import problemRouter from "./routes/problem.routes.js"
import submissionRouter from "./routes/submission.routes.js"
import aiChatingRouter from "./routes/aiChating.routes.js"
import videoRouter from "./routes/video.routes.js"
import cors from "cors"
const app = express();
import dotenv from "dotenv";

dotenv.config();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}))


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",userAuthRouter);
app.use("/api/problem",problemRouter);
app.use("/api/submission",submissionRouter);
app.use("/api/ai",aiChatingRouter);
import "dotenv/config"
app.use("/api/video",videoRouter);
export default app ;