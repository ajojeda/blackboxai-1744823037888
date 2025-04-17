# GoodieRun 2.0 Backend

Enterprise-grade backend system for GoodieRun 2.0, featuring ERP, Ticketing, Attendance, and Security modules.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password hashing
  - Token refresh mechanism

- **ERP Module**
  - Contract Management
  - Warehouse Management
  - Inventory Control
  - Purchase Orders

- **Ticketing Module**
  - Ticket Creation & Management
  - SLA Tracking
  - Priority Management
  - Status Updates

- **Attendance Module**
  - Clock In/Out System
  - Leave Management
  - Schedule Management
  - Attendance Reports

- **Security Module**
  - Incident Management
  - Access Control
  - Visitor Management
  - Security Reports

## Tech Stack

- Node.js & Express.js
- TypeScript
- MS SQL Server
- Winston Logger
- JWT Authentication
- Express Validator
- Helmet Security
- CORS Support

## Prerequisites

- Node.js >= 18.0.0
- MS SQL Server
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # Database Configuration
   DB_SERVER=localhost
   DB_NAME=GoodieRunDB
   DB_USER=sa
   DB_PASSWORD=YourStrong@Passw0rd

   # Default Admin User (for initial setup)
   DEFAULT_ADMIN_USERNAME=admin
   DEFAULT_ADMIN_EMAIL=admin@goodierun.com
   DEFAULT_ADMIN_PASSWORD=Admin123!

   # JWT Configuration
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Complete database initialization (schema, migrations, and seed data)
   npm run db:init

   # Or run individual steps:
   npm run db:setup  # Initialize schema and create default admin
   npm run migrate   # Run migrations
   npm run seed     # Seed initial data
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run typecheck` - Check TypeScript types
- `npm run db:setup` - Initialize database schema and create default admin
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database
- `npm run db:init` - Complete database initialization (setup + migrate + seed)

## API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@goodierun.com",
  "password": "Admin123!"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "admin@goodierun.com",
    "username": "admin",
    "firstName": "System",
    "lastName": "Administrator",
    "roles": ["ADMIN"],
    "siteId": "HQ"
  }
}
```

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "user1",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "siteId": "HQ",
  "departmentId": "IT",
  "roles": ["USER"]
}

Response (201 Created):
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "user1",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["USER"],
    "siteId": "HQ"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}

Response (200 OK):
{
  "token": "new_jwt_token_here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer jwt_token_here

Response (200 OK):
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "user1",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["USER"],
    "siteId": "HQ",
    "permissions": ["USER_READ", "USER_CREATE"]
  }
}
```

Error Responses:
```http
401 Unauthorized:
{
  "error": "Please authenticate"
}

403 Forbidden:
{
  "error": "Insufficient permissions"
}

400 Bad Request:
{
  "error": "Validation failed"
}
```

### ERP Endpoints

- GET `/api/erp/contracts` - List contracts
- POST `/api/erp/contracts` - Create contract
- GET `/api/erp/warehouse` - Warehouse management
- GET `/api/erp/purchase-orders` - List purchase orders

### Ticketing Endpoints

- POST `/api/ticketing/tickets` - Create ticket
- GET `/api/ticketing/tickets` - List tickets
- PATCH `/api/ticketing/tickets/:id/status` - Update ticket status
- GET `/api/ticketing/sla/metrics` - Get SLA metrics

### Attendance Endpoints

- POST `/api/attendance/clock-in` - Clock in
- POST `/api/attendance/clock-out` - Clock out
- GET `/api/attendance/reports/daily` - Daily attendance report
- POST `/api/attendance/leave-requests` - Submit leave request

### Security Endpoints

- POST `/api/security/incidents` - Report security incident
- GET `/api/security/access-cards` - List access cards
- POST `/api/security/visitors` - Register visitor
- GET `/api/security/reports/daily` - Daily security report

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── database/      # Database setup and migrations
│   ├── init.sql   # Database schema
│   ├── setup.ts   # Database initialization
│   ├── migrate.ts # Database migrations
│   └── seed.ts    # Database seeders
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # Route definitions
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── app.ts         # Express app setup
└── server.ts      # Server entry point
```

## Error Handling

The application uses a centralized error handling mechanism. All errors are logged using Winston logger and formatted appropriately before sending to the client.

## Logging

Winston logger is configured to:
- Log all errors in `logs/error.log`
- Log all requests in `logs/combined.log`
- Console output in development environment

## Database Management

### Schema and Initial Setup

The database schema is defined in `src/database/init.sql` and includes all core tables, indexes, and triggers. The initial setup can be performed using:

```bash
npm run db:setup
```

### Migrations

Database migrations are used to track and apply schema changes. Migrations are stored in `src/database/migrations` and can be run using:

```bash
npm run migrate
```

To create a new migration:

1. Create a new file in `src/database/migrations` with format `YYYYMMDDHHMMSS_description.sql`
2. Add your SQL changes
3. Run the migration command

### Seeding

Seed data is used to populate the database with initial data. Seeds are stored in `src/database/seeds` and can be run using:

```bash
npm run seed
```

### Complete Database Reset

To completely reset the database (useful in development):

```bash
npm run db:init
```

This will:
1. Run the initial schema setup
2. Apply all migrations
3. Seed the database with initial data

## Database Schema

The application uses Microsoft SQL Server with the following core tables:

- **Users**: Stores user information and authentication details
- **Sites**: Manages different locations/branches
- **Departments**: Organizes users into departments within sites
- **Roles**: Defines user roles (e.g., ADMIN, USER)
- **Permissions**: Stores available permissions
- **RolePermissions**: Maps roles to permissions
- **UserPermissions**: Stores user-specific permission overrides

## Authentication System

The authentication system provides:

- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permission management
- **Multi-site Support**: Users can be assigned to specific sites
- **Department-level Access**: Departmental access restrictions
- **Password Security**: 
  - Bcrypt hashing
  - Password complexity requirements
  - Failed login attempt tracking
- **Session Management**:
  - Token expiration
  - Refresh token support
  - Active session tracking

## Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT token authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- Request validation
- Input sanitization

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Maintain consistent file and folder naming:
  - Use camelCase for files: `userController.ts`
  - Use PascalCase for classes: `class UserController`
  - Use UPPER_SNAKE_CASE for constants: `const MAX_ATTEMPTS = 3`

### Testing

- Write unit tests for all new features
- Maintain test coverage above 80%
- Run tests before committing:
```bash
npm run test
npm run typecheck
npm run lint
```

### Database Changes

- Always create migrations for schema changes
- Never modify the production database directly
- Test migrations with rollback scenarios
- Document complex SQL queries

### Security Practices

- Never commit sensitive data (use environment variables)
- Validate all user inputs
- Use parameterized queries for database operations
- Keep dependencies up to date
- Follow the principle of least privilege

### Git Workflow

1. Create a feature branch from `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit using conventional commits:
   ```bash
   git commit -m "feat: add user authentication"
   git commit -m "fix: resolve login validation issue"
   ```

3. Keep your branch up to date:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

4. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request with:
   - Clear description of changes
   - List of tested scenarios
   - Screenshots (if UI changes)
   - Migration steps (if any)

### Code Review Guidelines

- Review for:
  - Security vulnerabilities
  - Performance implications
  - Code maintainability
  - Test coverage
  - Documentation updates

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
Error: Failed to connect to database
```
- Check if SQL Server is running
- Verify database credentials in `.env`
- Ensure the database exists
- Check network connectivity and firewall settings

#### Authentication Issues
```bash
Error: Invalid token
```
- Check if JWT_SECRET matches in `.env`
- Verify token expiration
- Clear browser storage and re-login

#### Migration Failures
```bash
Error: Migration failed
```
- Check if database user has sufficient permissions
- Verify SQL syntax in migration files
- Look for conflicting schema changes
- Check if target tables exist

#### Build Issues
```bash
Error: TypeScript compilation failed
```
- Run `npm run clean` and rebuild
- Check for missing dependencies
- Verify TypeScript configuration
- Clear node_modules and reinstall

### Getting Help

1. Check the error logs in `logs/error.log`
2. Review related documentation
3. Search existing GitHub issues
4. Contact the development team

## License

This project is proprietary and confidential. All rights reserved.

© 2024 GoodieRun. Unauthorized copying or distribution of this software is strictly prohibited.
