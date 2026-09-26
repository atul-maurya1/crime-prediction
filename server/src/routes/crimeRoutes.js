import express from 'express';
import { getCrimes, getCrime, createCrime, updateCrime, deleteCrime } from '../controllers/crimeController.js';
import { protect, authorize } from '../middleware/auth.js';
import { crimeValidator, crimeUpdateValidator } from '../validators/crimeValidator.js';

const router = express.Router();

router.route('/')
  .get(protect, getCrimes)
  .post(protect, authorize('admin'), crimeValidator, createCrime);

router.route('/:id')
  .get(protect, getCrime)
  .put(protect, authorize('admin'), crimeUpdateValidator, updateCrime)
  .delete(protect, authorize('admin'), deleteCrime);

export default router;
