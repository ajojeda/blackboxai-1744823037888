import { Router } from 'express';
import authRoutes from './auth.routes';
import erpRoutes from './erp.routes';
import ticketingRoutes from './ticketing.routes';
import attendanceRoutes from './attendance.routes';
import securityRoutes from './security.routes';

const router = Router();

// API Version prefix
const API_VERSION = '/api/v1';

// Mount routes
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/erp`, erpRoutes);
router.use(`${API_VERSION}/ticketing`, ticketingRoutes);
router.use(`${API_VERSION}/attendance`, attendanceRoutes);
router.use(`${API_VERSION}/security`, securityRoutes);

export {
  router as default,
  authRoutes,
  erpRoutes,
  ticketingRoutes,
  attendanceRoutes,
  securityRoutes
};
