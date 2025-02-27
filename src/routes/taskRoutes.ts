import express from "express";
import authMiddleware from "../middleware/auth";
import { checkRole } from "../middleware/role";
import { create, getAll, update, remove } from "../controllers/taskController";

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getAll);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, checkRole(["admin"]), remove);

export default router;
