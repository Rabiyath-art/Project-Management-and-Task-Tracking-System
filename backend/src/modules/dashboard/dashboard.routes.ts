import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { getDashboard } from './dashboard.controller.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getDashboard);

export default router;