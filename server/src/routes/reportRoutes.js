import express from 'express';
import { exportCrimesCSV } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/crimes.csv', protect, exportCrimesCSV);

export default router;
