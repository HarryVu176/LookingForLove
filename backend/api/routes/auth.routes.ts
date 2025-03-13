import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/upgrade', authMiddleware, authController.upgradeMembership);
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
