import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';

import {
  getNotifications,
  markNotificationRead,
} from './notification.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getNotifications);
router.patch('/:notificationId/read', markNotificationRead);

export default router;