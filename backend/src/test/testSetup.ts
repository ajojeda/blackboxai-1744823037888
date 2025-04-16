import dotenv from 'dotenv';
import { dbConfig } from '../config/database';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Set test environment variables if not already set
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Mock database configuration for testing
jest.mock('../config/database', () => ({
  dbConfig: {
    user: 'test_user',
    password: 'test_password',
    database: 'test_db',
    server: 'localhost',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  }
}));

// Mock logger to prevent console output during tests
jest.mock('../utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Global test setup
global.beforeAll(() => {
  // Add any global setup needed before all tests
});

global.afterAll(() => {
  // Add any global cleanup needed after all tests
});

// Reset mocks before each test
global.beforeEach(() => {
  jest.clearAllMocks();
});
