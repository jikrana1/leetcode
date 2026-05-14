import express from "express"
import { userAuthMiddleware } from "../middleware/userAuth.middleware.js";
import { aiChating } from "../controllers/aiChating.controller.js";
const router = express.Router();

router.post("/chat",userAuthMiddleware,aiChating);
export default router;
