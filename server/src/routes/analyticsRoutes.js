import express from 'express';
import { 
  getSummary, 
  getTrends, 
  getByType, 
  getByLocation, 
  getByTime, 
  getSeverityAnalysis 
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All analytics routes are protected

router.get('/summary', getSummary);
router.get('/trends', getTrends);
router.get('/by-type', getByType);
router.get('/by-location', getByLocation);
router.get('/by-time', getByTime);
router.get('/severity', getSeverityAnalysis);

export default router;
