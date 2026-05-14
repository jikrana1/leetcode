import express from "express"
import { runCode, submitCode } from "../controllers/submission.controller.js";
import { userAuthMiddleware } from "../middleware/userAuth.middleware.js";
const router = express.Router();
router.post("/runCode/:pId",userAuthMiddleware ,runCode);
router.post("/submitted/:id",userAuthMiddleware , submitCode);
export default router