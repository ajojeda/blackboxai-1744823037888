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
   DB_HOST=localhost
   DB_USER=sa
   DB_PASSWORD=YourStrong@Passw0rd
   DB_NAME=goodierun

   # JWT Configuration
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   npm run migrate
   npm run seed
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
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database

## API Documentation

### Authentication Endpoints

- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/register` - User registration
- POST `/api/v1/auth/refresh-token` - Refresh access token
- GET `/api/v1/auth/me` - Get current user info

### ERP Endpoints

- GET `/api/v1/erp/contracts` - List contracts
- POST `/api/v1/erp/contracts` - Create contract
- GET `/api/v1/erp/warehouse` - Warehouse management
- GET `/api/v1/erp/purchase-orders` - List purchase orders

### Ticketing Endpoints

- POST `/api/v1/ticketing/tickets` - Create ticket
- GET `/api/v1/ticketing/tickets` - List tickets
- PATCH `/api/v1/ticketing/tickets/:id/status` - Update ticket status
- GET `/api/v1/ticketing/sla/metrics` - Get SLA metrics

### Attendance Endpoints

- POST `/api/v1/attendance/clock-in` - Clock in
- POST `/api/v1/attendance/clock-out` - Clock out
- GET `/api/v1/attendance/reports/daily` - Daily attendance report
- POST `/api/v1/attendance/leave-requests` - Submit leave request

### Security Endpoints

- POST `/api/v1/security/incidents` - Report security incident
- GET `/api/v1/security/access-cards` - List access cards
- POST `/api/v1/security/visitors` - Register visitor
- GET `/api/v1/security/reports/daily` - Daily security report

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
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

## Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT token authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is proprietary and confidential.
