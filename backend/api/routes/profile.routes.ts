import { Router } from 'express';
import profileController from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, profileController.updateProfile);
router.put('/skills', authMiddleware, profileController.updateTechnicalSkills);
router.put('/photo', authMiddleware, profileController.updateProfilePhoto);

export default router;
