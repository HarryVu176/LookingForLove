import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import matchRoutes from './match.routes';
import statisticsRoutes from './statistics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/matches', matchRoutes);
router.use('/statistics', statisticsRoutes);

export default router;
