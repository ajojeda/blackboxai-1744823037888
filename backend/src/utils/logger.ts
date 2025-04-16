import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define log directories
const logDir = 'logs';
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

// Create logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format,
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: errorLogPath,
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: combinedLogPath,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
  ],
});

// Add console transport if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Create a stream object for Morgan middleware
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Export logger instance
export default logger;

// Utility functions for structured logging
export const logError = (error: Error, context?: string) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

export const logInfo = (message: string, metadata?: any) => {
  logger.info({
    message,
    metadata,
    timestamp: new Date().toISOString()
  });
};

export const logWarning = (message: string, metadata?: any) => {
  logger.warn({
    message,
    metadata,
    timestamp: new Date().toISOString()
  });
};

export const logDebug = (message: string, metadata?: any) => {
  logger.debug({
    message,
    metadata,
    timestamp: new Date().toISOString()
  });
};

// Audit logging function
export const logAudit = (
  userId: string,
  action: string,
  resource: string,
  details?: any
) => {
  logger.info({
    type: 'AUDIT',
    userId,
    action,
    resource,
    details,
    timestamp: new Date().toISOString()
  });
};
