# Node.js Web Server

A comprehensive Node.js server with Express.js, MongoDB, and JWT authentication.

## Features

- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Rate Limiting** - Protection against brute force attacks
- **CORS Support** - Cross-origin resource sharing
- **Security Headers** - Helmet.js for security
- **Cookie Management** - HTTP-only cookies for tokens
- **Input Validation** - Request validation and sanitization
- **Error Handling** - Comprehensive error handling middleware

## Project Structure

```
Pace/
├── server.js                 # Main server file
├── config.js                # Configuration settings
├── src/
│   ├── models/
│   │   └── User.js          # User model with Mongoose schema
│   ├── routes/
│   │   └── auth.js          # Authentication routes
│   ├── middleware/
│   │   └── requireAuth.js   # Authentication middleware
│   └── utils/
│       └── jwt.js           # JWT utility functions
└── README.md                # This file
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Install nodemon for development (optional):

```bash
npm install -g nodemon
```

3. Make sure MongoDB is running on your system:

```bash
# Start MongoDB (if installed locally)
mongod
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URL=mongodb://127.0.0.1:27017/user-auth

# JWT Configuration
JWT_ACCESS_SECRET=your_super_secure_access_secret_key_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Alternative

```bash
npm run server
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description              | Access  |
| ------ | ----------- | ------------------------ | ------- |
| POST   | `/register` | Register a new user      | Public  |
| POST   | `/login`    | Login user               | Public  |
| POST   | `/refresh`  | Refresh access token     | Public  |
| POST   | `/logout`   | Logout user              | Private |
| GET    | `/me`       | Get current user profile | Private |
| PUT    | `/profile`  | Update user profile      | Private |

### Other Routes

| Method | Endpoint         | Description             | Access  |
| ------ | ---------------- | ----------------------- | ------- |
| GET    | `/`              | Server information      | Public  |
| GET    | `/api/health`    | Health check            | Public  |
| GET    | `/api/protected` | Protected route example | Private |

## API Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "password123"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get User Profile

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 12 rounds
- **JWT Tokens**: Secure token-based authentication with access and refresh tokens
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js provides security headers
- **Input Validation**: Request validation and sanitization
- **HTTP-Only Cookies**: Tokens stored in secure HTTP-only cookies

## Database Schema

### User Model

- `username` (String, required, unique)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `firstName` (String, optional)
- `lastName` (String, optional)
- `role` (String, enum: 'user', 'admin', default: 'user')
- `isActive` (Boolean, default: true)
- `lastLogin` (Date)
- `refreshTokens` (Array of tokens)
- `createdAt` (Date)
- `updatedAt` (Date)

## Error Handling

The server includes comprehensive error handling:

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

All errors return JSON responses with error messages and status codes.

## Development

### Adding New Routes

1. Create route file in `src/routes/`
2. Import and use in `server.js`
3. Add appropriate middleware for authentication

### Adding New Models

1. Create model file in `src/models/`
2. Define Mongoose schema
3. Export model

### Adding Middleware

1. Create middleware file in `src/middleware/`
2. Export middleware function
3. Use in routes or server.js

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string in configuration
- Verify database permissions

### JWT Token Issues

- Check JWT secrets in environment variables
- Verify token expiration settings
- Ensure proper token format in requests

### CORS Issues

- Update CORS origin in configuration
- Check frontend URL settings
- Verify credentials setting

## License

ISC
