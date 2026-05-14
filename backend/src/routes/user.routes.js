import express from "express"
import { adminRegister, isCheckLogin, userLoggout, userLogin, userRegister } from "../controllers/user.controller.js";
import { userAuthMiddleware } from "../middleware/userAuth.middleware.js";

const router = express.Router();

router.get("/user/check",userAuthMiddleware,isCheckLogin);
router.post("/user/register",userRegister);
router.post("/user/login", userLogin);
router.post("/user/logout", userAuthMiddleware, userLoggout);
router.post("/admin/register", userAuthMiddleware, adminRegister);
export default router;