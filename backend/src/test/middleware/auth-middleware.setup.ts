import { AppError } from '../../middleware/errorHandler';

// Mock mssql module
jest.mock('mssql', () => ({
  ConnectionPool: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    request: jest.fn().mockReturnValue({
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ recordset: [] })
    })
  }))
}));

// Extend Jest matchers
expect.extend({
  toBeAppError(received: unknown, expectedStatus: number) {
    const pass = received instanceof AppError && received.statusCode === expectedStatus;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be an AppError with status ${expectedStatus}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be an AppError with status ${expectedStatus}`,
        pass: false,
      };
    }
  },
});

// Extend Jest types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAppError(expectedStatus: number): R;
    }
  }
}

// Set timezone for consistent date handling
process.env.TZ = 'UTC';

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
