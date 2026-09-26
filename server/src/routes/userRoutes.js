import express from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All user routes are restricted to admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id/role')
  .put(updateUserRole);

router.route('/:id')
  .delete(deleteUser);

export default router;
