import express from "express"
import { isAdminMiddleware } from "../middleware/adminAuth.middleware.js";
import { createProblem, deletedProblem, getAllProblems, getOneProblemById, solvedAllProblembyUser, submittedProblem, updateProblem } from "../controllers/problem.controller.js";
import { userAuthMiddleware } from "../middleware/userAuth.middleware.js";
const router = express.Router();


router.post("/create", isAdminMiddleware,createProblem);
router.put("/update/:id", isAdminMiddleware,updateProblem);
router.delete("/delete/:id", isAdminMiddleware,deletedProblem);

router.get("/problemById/:id",userAuthMiddleware,getOneProblemById);
router.get("/getAll",userAuthMiddleware,getAllProblems);
router.get("/problemSolvedByUser",userAuthMiddleware,solvedAllProblembyUser);
router.post("/submittedProblem/:pId",userAuthMiddleware,submittedProblem)
export default router;