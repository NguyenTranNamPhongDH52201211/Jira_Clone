import {Router} from 'express';
import { ProjectController } from '../controllers/projectController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateCreateProject, validateUpdateProject, validateAddMember, validateProjectId, validateUserId } from '../middlewares/validation';

const router= Router();

router.use(authMiddleware);


router.post('/',validateCreateProject,ProjectController.createProject);

router.get('/', ProjectController.getUserProjects);

router.get('/:id', validateProjectId, ProjectController.getProjectById);

router.put('/:id', validateProjectId, validateUpdateProject,ProjectController.updateProject);

router.delete('/:id', validateProjectId, ProjectController.deleteProject);

router.post('/:id/members',validateProjectId, validateAddMember, ProjectController.addMember);

router.delete('/:id/members/:userId', validateProjectId,validateUserId, ProjectController.removeMember);

router.get('/:id/members', validateProjectId,ProjectController.getProjectMembers);

export default router;