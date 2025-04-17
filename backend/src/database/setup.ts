import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import Database from '../config/database';
import logger from '../utils/logger';

interface DbRecord {
    id: string;
}

interface SiteRecord extends DbRecord {
    code: string;
}

interface UserRecord extends DbRecord {
    email: string;
    username: string;
}

async function initializeDatabase() {
    try {
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'init.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');

        // Split the SQL content into individual commands
        const commands = sqlContent.split('GO');

        // Execute each command
        for (const command of commands) {
            if (command.trim()) {
                await Database.query(command);
            }
        }

        logger.info('Database schema created successfully');

        // Create default admin user if it doesn't exist
        const defaultAdmin = {
            username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
            email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@goodierun.com',
            password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!',
            firstName: 'System',
            lastName: 'Administrator',
            roles: JSON.stringify(['ADMIN']),
            siteId: 'HQ',
            departmentId: 'IT',
            isActive: true
        };

        // Check if admin user exists
        const existingAdmin = await Database.query<UserRecord>(
            'SELECT id FROM Users WHERE email = @param0',
            [defaultAdmin.email]
        );

        if (existingAdmin.length === 0) {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(defaultAdmin.password, salt);

            // Create admin user
            await Database.query(`
                INSERT INTO Users (
                    username, email, password, firstName, lastName,
                    roles, siteId, departmentId, isActive
                ) VALUES (
                    @param0, @param1, @param2, @param3, @param4,
                    @param5, @param6, @param7, @param8
                )
            `, [
                defaultAdmin.username,
                defaultAdmin.email,
                hashedPassword,
                defaultAdmin.firstName,
                defaultAdmin.lastName,
                defaultAdmin.roles,
                defaultAdmin.siteId,
                defaultAdmin.departmentId,
                defaultAdmin.isActive
            ]);

            logger.info('Default admin user created successfully');
        } else {
            logger.info('Default admin user already exists');
        }

        // Create default site if it doesn't exist
        const defaultSite = {
            name: 'Headquarters',
            code: 'HQ',
            address: '123 Main Street'
        };

        const existingSite = await Database.query<SiteRecord>(
            'SELECT id FROM Sites WHERE code = @param0',
            [defaultSite.code]
        );

        if (existingSite.length === 0) {
            await Database.query(`
                INSERT INTO Sites (name, code, address)
                VALUES (@param0, @param1, @param2)
            `, [
                defaultSite.name,
                defaultSite.code,
                defaultSite.address
            ]);

            logger.info('Default site created successfully');
        } else {
            logger.info('Default site already exists');
        }

        // Create default department if it doesn't exist
        const defaultDepartment = {
            name: 'Information Technology',
            code: 'IT'
        };

        const existingDepartment = await Database.query<DbRecord>(
            'SELECT id FROM Departments WHERE code = @param0',
            [defaultDepartment.code]
        );

        if (existingDepartment.length === 0) {
            // Get the site ID
            interface SiteRecord {
                id: string;
            }

            const site = await Database.query<SiteRecord>(
                'SELECT id FROM Sites WHERE code = @param0',
                ['HQ']
            );

            if (site.length > 0) {
                await Database.query(`
                    INSERT INTO Departments (name, code, siteId)
                    VALUES (@param0, @param1, @param2)
                `, [
                    defaultDepartment.name,
                    defaultDepartment.code,
                    site[0].id
                ]);

                logger.info('Default department created successfully');
            }
        } else {
            logger.info('Default department already exists');
        }

    } catch (error) {
        logger.error('Error initializing database:', error);
        throw error;
    }
}

// Execute if running directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            logger.info('Database initialization completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Database initialization failed:', error);
            process.exit(1);
        });
}

export default initializeDatabase;
