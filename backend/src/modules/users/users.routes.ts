import { Router } from "express";
import { getUsers } from "./users.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken);
router.get("/", getUsers);

export default router;