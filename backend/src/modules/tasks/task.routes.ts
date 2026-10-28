import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';

import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} from './task.controller.js';

const router = Router();

router.use(authenticateToken);

router.post('/projects/:projectId/tasks', createTask);
router.get('/projects/:projectId/tasks', getTasks);

router.patch('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId', deleteTask);

export default router;