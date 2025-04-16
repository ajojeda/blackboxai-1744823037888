import dotenv from 'dotenv';

export default async (): Promise<void> => {
  // Load test environment variables
  dotenv.config({ path: '.env.test' });

  // Set test-specific environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  process.env.JWT_EXPIRES_IN = '1h';

  // Add any other global setup needed before running tests
  console.log('Global test setup complete');
};
