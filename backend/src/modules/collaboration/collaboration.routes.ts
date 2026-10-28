import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';

import {
    addComment,
    getComments,
    getTaskActivities,
} from './collaboration.controller.js';

const router = Router();

router.use(authenticateToken);

router.post('/tasks/:taskId/comments', addComment);
router.get('/tasks/:taskId/comments', getComments);
router.get('/tasks/:taskId/activities', getTaskActivities);

export default router;