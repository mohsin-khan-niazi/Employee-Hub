# EmployeeHub

A comprehensive employee and human resources management system built with NestJS and MongoDB. EmployeeHub streamlines employee information management, leave tracking, authentication, and role-based access control.

## Features

- **Employee Management** - Manage employee profiles with personal, employment, and banking information
- **Leave Management** - Track and manage employee leaves with leave counts and status updates
- **Authentication** - Secure JWT-based authentication with email verification
- **Email Notifications** - Automated emails for account activation and password resets
- **File Storage** - S3 integration for secure file uploads and management
- **Role-Based Access Control** - Fine-grained permissions based on user roles
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Professional Email Templates** - Handlebars-based email templates for communications

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3
- **Email**: NodeMailer with Handlebars templates
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

Before running the project, ensure you have installed:

- Node.js 20 or higher
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employeehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:

   ```env
   # Application
   NODE_ENV=development
   APP_PORT=5000
   APP_NAME=EmployeeHub
   API_PREFIX=api/v1
   
   # Frontend/Backend URLs
   FRONTEND_DOMAIN=http://localhost:3005
   BACKEND_DOMAIN=http://localhost:3000
   
   # Database
   DATABASE_URL=mongodb://localhost:27017
   DATABASE_NAME=employeehub
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   
   # Email (SMTP)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_FROM=noreply@employeehub.com
   MAIL_USER=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   
   # AWS S3
   FILE_DRIVER=s3-presigned (supported values: "local", "s3", "s3-presigned")
   S3_BUCKET_NAME=your-bucket-name
   S3_BUCKET_REGION=us-east-1
   ACCESS_KEY_ID=your_aws_access_key
   SECRET_ACCESS_KEY=your_aws_secret_key
   ```

## Running the Project

### Development Mode

```bash
npm run start:dev
```

The server will start on `http://localhost:5000` and API docs will be available at `http://localhost:5000/docs`

### Production Mode

```bash
# Build
npm run build

# Start
npm run start:prod
```

### Linting and Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

## Project Structure

```
src/
├── auth/                 # Authentication & JWT strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/       # JWT authentication strategy
│   ├── dto/              # Auth-related DTOs
│   └── config/           # Auth configuration
├── users/                # User & employee management
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── entities/         # MongoDB schemas
│   └── dto/              # User DTOs
├── leaves/               # Leave management module
│   ├── leave.controller.ts
│   ├── leave.service.ts
│   ├── leave.schema.ts
│   └── dtos/             # Leave DTOs
├── mail/                 # Email service
│   ├── mail.service.ts
│   ├── mail-templates/   # Handlebars templates
│   └── config/           # Email configuration
├── s3/                   # AWS S3 file storage
│   ├── s3.service.ts
│   └── config/           # S3 configuration
├── roles/                # Role-based access control
│   ├── roles.guard.ts
│   ├── roles.decorator.ts
│   └── roles.enum.ts
├── database/             # Database configuration
│   ├── mongoose-config.service.ts
│   └── seeds/            # Database seeding
├── config/               # Application configuration
│   ├── app.config.ts
│   ├── config.type.ts
│   └── app-config.type.ts
└── utils/                # Utility functions & helpers
```

## API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:5000/docs`

The interactive documentation allows you to explore and test all API endpoints.

## Database Setup

### Using Local MongoDB

```bash
# Start MongoDB service
mongod
```

### Using MongoDB Atlas (Cloud)

Update the `DATABASE_URL` in `.env` with your MongoDB Atlas connection string:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Running Database Seeds

To seed initial data:

```bash
npm run seed
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. To authenticate:

1. Register a new user via `/auth/register`
2. Login via `/auth/login` to receive a JWT token
3. Include the token in the `Authorization` header for protected endpoints:

```bash
Authorization: Bearer <your_jwt_token>
```

## Email Configuration

The system uses SMTP for sending emails. Supported providers:

- Gmail (using App Passwords)
- AWS SES
- SendGrid
- Any SMTP provider

Configure in `.env`:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_FROM=noreply@employeehub.com
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## File Storage

Files are managed through AWS S3. Configure your S3 credentials in `.env`:

```env
S3_BUCKET_NAME=your-bucket-name
S3_BUCKET_REGION=us-east-1
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key
```

## Roles & Permissions

The system supports role-based access control with the following roles:

- **ADMIN** - Full system access
- **MANAGER** - Employee and leave management
- **EMPLOYEE** - Personal profile and leave requests

## Troubleshooting

### Connection Refused Error
- Ensure MongoDB is running
- Check `DATABASE_URL` in `.env`

### JWT Authentication Fails
- Verify `JWT_SECRET` is configured
- Check token expiration with `JWT_EXPIRES_IN`

### Email Not Sending
- Verify SMTP credentials in `.env`
- Check firewall/network settings
- For Gmail, enable "Less secure app access" or use App Passwords

### S3 Upload Fails
- Verify AWS credentials
- Ensure S3 bucket exists and is in the correct region
- Check IAM permissions for the AWS user
