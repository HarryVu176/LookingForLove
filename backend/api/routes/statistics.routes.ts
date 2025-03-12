import { Router } from 'express';
import statisticsController from '../controllers/statistics.controller';
import { authMiddleware, requireProductManager } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, requireProductManager, statisticsController.getStatistics);
router.post('/update', authMiddleware, requireProductManager, statisticsController.updateStatistics);
router.get('/match-quality', authMiddleware, requireProductManager, statisticsController.getMatchQualityStatistics);

export default router;
