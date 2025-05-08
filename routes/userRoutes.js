import express from 'express';
import {
  checkUserExists,
  createUser,
  sendOtp,
  verifyOtp,
  getUserById,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/users/identity-exist', checkUserExists);
router.post('/users', createUser);
router.post('/otp', sendOtp);
router.post('/otp-verify', verifyOtp);
router.get('/users/:id', getUserById);


export default router;
