import { ConnectionPool } from 'mssql';
import { dbConfig } from '../config/database';
import { TestConnection } from './types/test-env';
import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import { AppError } from '../middleware/errorHandler';

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

let connection: TestConnection;

beforeAll(async () => {
  // Override database name for tests
  const testConfig = {
    ...dbConfig,
    database: process.env.DB_NAME || 'goodierun_test',
  };
  
  const pool = await new ConnectionPool(testConfig).connect();
  connection = pool as unknown as TestConnection;
});

afterAll(async () => {
  if (connection) {
    await connection.close();
  }
});

beforeEach(async () => {
  if (connection) {
    try {
      // Clear test database tables
      await connection.query`
        IF OBJECT_ID('UserRoles', 'U') IS NOT NULL
          DELETE FROM UserRoles;
        IF OBJECT_ID('Users', 'U') IS NOT NULL
          DELETE FROM Users;
        IF OBJECT_ID('Roles', 'U') IS NOT NULL
          DELETE FROM Roles;
        IF OBJECT_ID('Incidents', 'U') IS NOT NULL
          DELETE FROM Incidents;
        IF OBJECT_ID('AccessCards', 'U') IS NOT NULL
          DELETE FROM AccessCards;
        IF OBJECT_ID('Attendance', 'U') IS NOT NULL
          DELETE FROM Attendance;
        IF OBJECT_ID('LeaveRequests', 'U') IS NOT NULL
          DELETE FROM LeaveRequests;
        IF OBJECT_ID('Tickets', 'U') IS NOT NULL
          DELETE FROM Tickets;
      `;

      // Reset identity columns
      await connection.query`
        IF OBJECT_ID('Users', 'U') IS NOT NULL
          DBCC CHECKIDENT ('Users', RESEED, 0);
        IF OBJECT_ID('Roles', 'U') IS NOT NULL
          DBCC CHECKIDENT ('Roles', RESEED, 0);
        IF OBJECT_ID('Incidents', 'U') IS NOT NULL
          DBCC CHECKIDENT ('Incidents', RESEED, 0);
        IF OBJECT_ID('Tickets', 'U') IS NOT NULL
          DBCC CHECKIDENT ('Tickets', RESEED, 0);
      `;
    } catch (error) {
      console.error('Error in test database cleanup:', error);
      throw error;
    }
  }
});

// Define test helper types and utilities
interface TestUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

function createTestError(message: string, statusCode: number): AppError {
  return new AppError(message, statusCode);
}

// Global test helpers
declare global {
  var createTestUser: (userData: {
    username: string;
    email: string;
    password: string;
    roles: string[];
  }) => Promise<TestUser | null>;
  
  var generateTestToken: (userId: string) => Promise<string>;
  
  var createTestError: (message: string, statusCode: number) => AppError;
}

// Set timezone for consistent date handling
process.env.TZ = 'UTC';

global.createTestUser = async (userData: {
  username: string;
  email: string;
  password: string;
  roles: string[];
}): Promise<TestUser | null> => {
  // Implementation will be added when User model is complete
  return null;
};

global.generateTestToken = async (userId: string): Promise<string> => {
  // Implementation will be added when auth service is complete
  return '';
};

global.createTestError = createTestError;

// Export connection and types for use in tests
export { connection, TestUser };
