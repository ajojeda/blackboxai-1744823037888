import sql from 'mssql';
import logger from '../utils/logger';

export const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'GoodieRunDB',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    // Auth related configs
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

class Database {
    private static pool: sql.ConnectionPool;
    private static poolConnect: Promise<sql.ConnectionPool>;

    static async connect(): Promise<sql.ConnectionPool> {
        try {
            if (this.pool) {
                return this.pool;
            }

            this.pool = new sql.ConnectionPool(config);
            this.poolConnect = this.pool.connect();

            this.pool.on('error', (err) => {
                logger.error('SQL Pool Error', err);
            });

            await this.poolConnect;
            logger.info('Connected to SQL Server');
            
            return this.pool;
        } catch (err) {
            logger.error('Database Connection Error:', err);
            throw new Error('Failed to connect to database');
        }
    }

    static async query<T>(text: string, params: any[] = []): Promise<T[]> {
        const pool = await this.connect();
        try {
            const request = pool.request();
            
            // Add parameters to the request
            params.forEach((param, index) => {
                request.input(`param${index}`, param);
            });

            const result = await request.query(text);
            return result.recordset;
        } catch (err) {
            logger.error('Query Error:', err);
            throw err;
        }
    }

    static async transaction<T>(
        callback: (transaction: sql.Transaction) => Promise<T>
    ): Promise<T> {
        const pool = await this.connect();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (err) {
            await transaction.rollback();
            logger.error('Transaction Error:', err);
            throw err;
        }
    }

    static async close(): Promise<void> {
        try {
            if (this.pool) {
                await this.pool.close();
                logger.info('Database connection closed');
            }
        } catch (err) {
            logger.error('Error closing database connection:', err);
            throw err;
        }
    }
}

export default Database;
