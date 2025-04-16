import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connect, ConnectionPool } from 'mssql';
import { dbConfig } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import logger, { stream } from './utils/logger';

// Import routes (we'll create these next)
import authRoutes from './routes/auth.routes';
import erpRoutes from './routes/erp.routes';
import ticketingRoutes from './routes/ticketing.routes';
import attendanceRoutes from './routes/attendance.routes';
import securityRoutes from './routes/security.routes';

class App {
  public app: Application;
  private dbPool: ConnectionPool | null = null;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      this.dbPool = await connect(dbConfig);
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet()); // Helps secure Express apps with various HTTP headers
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    this.app.use(compression());

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined', { stream }));
    }

    // Add request timestamp
    this.app.use((req, res, next) => {
      req.timestamp = new Date();
      next();
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date(),
        environment: process.env.NODE_ENV,
        database: this.dbPool?.connected ? 'connected' : 'disconnected'
      });
    });
  }

  private initializeRoutes(): void {
    // API version prefix
    const apiPrefix = '/api/v1';

    // Mount routes
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/erp`, erpRoutes);
    this.app.use(`${apiPrefix}/ticketing`, ticketingRoutes);
    this.app.use(`${apiPrefix}/attendance`, attendanceRoutes);
    this.app.use(`${apiPrefix}/security`, securityRoutes);

    // Documentation route (if we add Swagger/OpenAPI later)
    if (process.env.NODE_ENV !== 'production') {
      this.app.get(`${apiPrefix}/docs`, (req, res) => {
        res.redirect('/api-docs');
      });
    }
  }

  private initializeErrorHandling(): void {
    // Handle 404 errors
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    await this.initializeDatabase();
    const port = process.env.PORT || 4000;
    this.app.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  }

  // Graceful shutdown
  public async shutdown(): Promise<void> {
    if (this.dbPool) {
      await this.dbPool.close();
      logger.info('Database connection closed');
    }
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default App;
