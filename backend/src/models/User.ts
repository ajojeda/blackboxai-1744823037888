import { connect, ConnectionPool } from 'mssql';
import * as bcrypt from 'bcryptjs';
import { dbConfig } from '../config/database';

export interface IUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  siteId: string;
  isActive: boolean;
}

export class User {
  private static async getConnection(): Promise<ConnectionPool> {
    try {
      return await connect(dbConfig);
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`);
    }
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    try {
      const pool = await this.getConnection();
      const result = await pool.request()
        .input('email', email)
        .query(`
          SELECT 
            u.Id,
            u.Username,
            u.Email,
            u.FirstName,
            u.LastName,
            u.IsActive,
            u.SiteId,
            STRING_AGG(r.Name, ',') as Roles
          FROM Users u
          LEFT JOIN UserRoles ur ON u.Id = ur.UserId
          LEFT JOIN Roles r ON ur.RoleId = r.Id
          WHERE u.Email = @email
          GROUP BY 
            u.Id,
            u.Username,
            u.Email,
            u.FirstName,
            u.LastName,
            u.IsActive,
            u.SiteId
        `);

      if (result.recordset.length === 0) {
        return null;
      }

      const user = result.recordset[0];
      return {
        id: user.Id,
        username: user.Username,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        isActive: user.IsActive,
        siteId: user.SiteId,
        roles: user.Roles ? user.Roles.split(',') : []
      };
    } catch (error) {
      throw new Error(`Error finding user: ${error}`);
    }
  }

  static async validatePassword(email: string, password: string): Promise<boolean> {
    try {
      const pool = await this.getConnection();
      const result = await pool.request()
        .input('email', email)
        .query('SELECT PasswordHash FROM Users WHERE Email = @email');

      if (result.recordset.length === 0) {
        return false;
      }

      const hash = result.recordset[0].PasswordHash;
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error(`Error validating password: ${error}`);
    }
  }

  static async create(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    siteId: string;
    roles: string[];
  }): Promise<IUser> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const pool = await this.getConnection();
      const transaction = pool.transaction();
      await transaction.begin();

      try {
        // Insert user
        const userResult = await transaction.request()
          .input('username', userData.username)
          .input('email', userData.email)
          .input('passwordHash', hashedPassword)
          .input('firstName', userData.firstName)
          .input('lastName', userData.lastName)
          .input('siteId', userData.siteId)
          .query(`
            INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, SiteId)
            OUTPUT INSERTED.Id
            VALUES (@username, @email, @passwordHash, @firstName, @lastName, @siteId)
          `);

        const userId = userResult.recordset[0].Id;

        // Insert user roles
        for (const roleName of userData.roles) {
          await transaction.request()
            .input('userId', userId)
            .input('roleName', roleName)
            .query(`
              INSERT INTO UserRoles (UserId, RoleId)
              SELECT @userId, Id FROM Roles WHERE Name = @roleName
            `);
        }

        await transaction.commit();

        return {
          id: userId,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          roles: userData.roles,
          siteId: userData.siteId,
          isActive: true
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }
}
