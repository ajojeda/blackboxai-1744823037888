import { Router } from 'express';
import { login, register, validateLogin, validateRegister } from '../controllers/auth.controller';
import { authenticate, refreshToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', authenticate, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

router.post('/logout', authenticate, (req: AuthRequest, res) => {
  res.json({ message: 'Successfully logged out' });
});

// Password reset routes
router.post('/forgot-password', (req, res) => {
  // TODO: Implement forgot password functionality
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/reset-password', (req, res) => {
  // TODO: Implement reset password functionality
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
