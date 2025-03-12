import { Router } from 'express';
import matchController from '../controllers/match.controller';
import { authMiddleware, requirePaidMembership } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, matchController.findMatches);
router.post('/:matchedUserId/contact', authMiddleware, requirePaidMembership, matchController.exposeContactInfo);
router.post('/:matchedUserId/rate', authMiddleware, matchController.rateMatch);

export default router;
