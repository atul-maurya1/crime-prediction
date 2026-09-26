import express from 'express';
import { createPrediction, getPredictions, getPrediction } from '../controllers/predictionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createPrediction)
  .get(getPredictions);

router.route('/:id')
  .get(getPrediction);

export default router;
