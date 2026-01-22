import {Router} from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRegister, validateLogin } from '../middlewares/validation';

const router= Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin,AuthController.login);


router.get('/me',authMiddleware,AuthController.getCurrentUser);
router.post('/logout',authMiddleware, AuthController.logout);

export default router;