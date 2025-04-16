import { Connection } from 'mssql';

declare global {
  namespace Express {
    interface Request {
      timestamp?: Date;
      dbConnection?: Connection;
    }
  }
}

export {};
