import {Router} from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRegistor, validateLogin } from '../middlewares/validation';

const router= Router();

router.post('/register', validateRegistor, AuthController.register);
router.post('/login', validateLogin,AuthController.login);


router.get('/me',authMiddleware,AuthController.getCurrentUser);
router.post('/logout',authMiddleware, AuthController.logout);

export default router;