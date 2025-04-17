import sql from 'mssql';
import bcrypt from 'bcryptjs';
import Database from '../config/database';
import logger from '../utils/logger';

export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: string[];
    siteId: string;
    departmentId: string;
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserCreate extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'> {
    password: string;
}

class User {
    static tableName = 'Users';

    static async findById(id: string): Promise<IUser | null> {
        try {
            const result = await Database.query<IUser>(
                `SELECT * FROM ${this.tableName} WHERE id = @param0`,
                [id]
            );
            return result[0] || null;
        } catch (error) {
            logger.error('Error finding user by ID:', error);
            throw error;
        }
    }

    static async findByEmail(email: string): Promise<IUser | null> {
        try {
            const result = await Database.query<IUser>(
                `SELECT * FROM ${this.tableName} WHERE email = @param0`,
                [email]
            );
            return result[0] || null;
        } catch (error) {
            logger.error('Error finding user by email:', error);
            throw error;
        }
    }

    static async findByUsername(username: string): Promise<IUser | null> {
        try {
            const result = await Database.query<IUser>(
                `SELECT * FROM ${this.tableName} WHERE username = @param0`,
                [username]
            );
            return result[0] || null;
        } catch (error) {
            logger.error('Error finding user by username:', error);
            throw error;
        }
    }

    static async create(userData: IUserCreate): Promise<IUser> {
        try {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const result = await Database.query<IUser>(
                `INSERT INTO ${this.tableName} (
                    username, email, password, firstName, lastName,
                    roles, siteId, departmentId, isActive
                ) VALUES (
                    @param0, @param1, @param2, @param3, @param4,
                    @param5, @param6, @param7, @param8
                )
                OUTPUT INSERTED.*`,
                [
                    userData.username,
                    userData.email,
                    hashedPassword,
                    userData.firstName,
                    userData.lastName,
                    JSON.stringify(userData.roles),
                    userData.siteId,
                    userData.departmentId,
                    userData.isActive
                ]
            );

            return result[0];
        } catch (error) {
            logger.error('Error creating user:', error);
            throw error;
        }
    }

    static async updateLastLogin(id: string): Promise<void> {
        try {
            await Database.query(
                `UPDATE ${this.tableName} 
                SET lastLogin = GETDATE() 
                WHERE id = @param0`,
                [id]
            );
        } catch (error) {
            logger.error('Error updating last login:', error);
            throw error;
        }
    }

    static async validatePassword(user: IUser, password: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, user.password);
        } catch (error) {
            logger.error('Error validating password:', error);
            throw error;
        }
    }

    static async getUserPermissions(userId: string): Promise<string[]> {
        try {
            const result = await Database.query<{ permissions: string }>(
                `SELECT p.name as permissions
                FROM UserPermissions up
                JOIN Permissions p ON up.permissionId = p.id
                WHERE up.userId = @param0`,
                [userId]
            );
            return result.map(r => r.permissions);
        } catch (error) {
            logger.error('Error getting user permissions:', error);
            throw error;
        }
    }

    static async getUserWithRolesAndPermissions(userId: string): Promise<IUser & { permissions: string[] }> {
        try {
            const user = await this.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const permissions = await this.getUserPermissions(userId);
            return { ...user, permissions };
        } catch (error) {
            logger.error('Error getting user with roles and permissions:', error);
            throw error;
        }
    }
}

export default User;
