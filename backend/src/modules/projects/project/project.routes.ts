import { Router } from 'express';
import { authenticateToken } from '../../../middleware/auth.middleware.js';

import { createProject, getProjects, getProject, updateProject, archiveProject, } from './project.controller.js';
import {
    getProjectMembers,
    addProjectMember,
    removeProjectMember,
} from '../projectMember/projectMember.controller.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:projectId', getProject);
router.patch('/:projectId', updateProject);
router.patch('/:projectId/archive', archiveProject);

router.get('/:projectId/members', getProjectMembers);

router.post('/:projectId/members', addProjectMember);

router.delete(
    '/:projectId/members/:userId',
    removeProjectMember,
);

export default router;