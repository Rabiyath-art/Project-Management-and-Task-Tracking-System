import { Router } from "express";
import { getUsers, createUser } from "./users.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken);
router.get("/", getUsers);
router.post("/", createUser);

export default router;