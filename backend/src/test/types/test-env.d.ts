import { Connection } from 'mssql';
import '@jest/globals';

declare global {
  namespace NodeJS {
    interface Global {
      createTestUser: (userData: {
        username: string;
        email: string;
        password: string;
        roles: string[];
      }) => Promise<TestUser | null>;
      
      generateTestToken: (userId: string) => Promise<string>;
    }
  }

  // Test User type
  interface TestUser {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
    siteId: string;
    isActive: boolean;
  }

  // Extend Express Request type for tests
  namespace Express {
    interface Request {
      user?: TestUser;
      timestamp?: Date;
      dbConnection?: Connection;
    }
  }

  // Add Jest globals explicitly
  const describe: jest.Describe;
  const expect: jest.Expect;
  const it: jest.It;
  const test: jest.It;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
  const jest: typeof import('@jest/globals').jest;
}

// Export types for use in tests
export interface TestConnection extends Connection {
  query: (strings: TemplateStringsArray, ...values: any[]) => Promise<any>;
}

export interface TestContext {
  connection: TestConnection;
  testUser?: TestUser;
  testToken?: string;
}
