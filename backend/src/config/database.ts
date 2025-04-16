import { config } from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config();

export const dbConfig: config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrong@Passw0rd',
  database: process.env.DB_NAME || 'goodierun',
  server: process.env.DB_HOST || 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Re-export config type for use in other files
export { config as SqlConfig } from 'mssql';
