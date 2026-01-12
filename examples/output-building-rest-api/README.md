# User Management REST API

A production-ready REST API for user management built with TypeScript, Express, and Node.js. Features full CRUD operations, comprehensive validation, error handling, and interactive API documentation.

## 🚀 Features

- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete users
- ✅ **Input Validation** - Zod-based validation with detailed error messages
- ✅ **Pagination Support** - Efficient list operations with customizable page size
- ✅ **Error Handling** - Comprehensive error handling with proper HTTP status codes
- ✅ **API Documentation** - Interactive Swagger UI at `/api-docs`
- ✅ **Type Safety** - Full TypeScript with strict mode enabled
- ✅ **Security** - Helmet for security headers, CORS support
- ✅ **Logging** - Structured logging with configurable log levels
- ✅ **Testing** - 96%+ test coverage with Jest and Supertest
- ✅ **Production Ready** - Health checks, graceful shutdown, environment configuration

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   LOG_LEVEL=info
   ```

## 🚦 Quick Start

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI Spec**: [docs/openapi.yaml](docs/openapi.yaml)

## 🔌 API Endpoints

### Health Check
```http
GET /health
```
Returns the health status of the API.

### User Management

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 30,
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:30:00.000Z"
  }
}
```

#### Get User by ID
```http
GET /api/users/{id}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 30,
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:30:00.000Z"
  }
}
```

#### List Users (with pagination)
```http
GET /api/users?page=1&pageSize=10
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "age": 30,
        "createdAt": "2026-01-12T10:30:00.000Z",
        "updatedAt": "2026-01-12T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

#### Update User
```http
PUT /api/users/{id}
Content-Type: application/json

{
  "email": "john.updated@example.com",
  "age": 31
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.updated@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 31,
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:35:00.000Z"
  }
}
```

#### Delete User
```http
DELETE /api/users/{id}
```

**Response (204 No Content)**

## 📊 Data Model

### User
```typescript
interface User {
  id: string;           // UUID v4
  email: string;        // Valid email format
  firstName: string;    // 2-50 characters
  lastName: string;     // 2-50 characters
  age?: number;         // Optional, 1-150
  createdAt: Date;      // Auto-generated
  updatedAt: Date;      // Auto-updated
}
```

### Validation Rules

- **email**: Required, must be valid email format
- **firstName**: Required, 2-50 characters, trimmed
- **lastName**: Required, 2-50 characters, trimmed
- **age**: Optional, must be between 1-150

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Test Coverage
Current coverage: **96.27%** statements, **94.2%** branches

```
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   96.27 |     94.2 |     100 |   96.13 |
 src               |     100 |      100 |     100 |     100 |
 src/controllers   |   87.27 |    85.71 |     100 |   87.27 |
 src/middleware    |     100 |      100 |     100 |     100 |
 src/models        |     100 |      100 |     100 |     100 |
 src/routes        |     100 |      100 |     100 |     100 |
 src/services      |     100 |      100 |     100 |     100 |
 src/utils         |     100 |    93.75 |     100 |     100 |
-------------------|---------|----------|---------|---------|
```

## 🔍 Code Quality

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## 📁 Project Structure

```
user-management-api/
├── src/
│   ├── controllers/       # Request handlers
│   │   └── userController.ts
│   ├── routes/           # Route definitions
│   │   └── userRoutes.ts
│   ├── models/           # Data models and validation
│   │   └── user.ts
│   ├── services/         # Business logic
│   │   └── userService.ts
│   ├── middleware/       # Express middleware
│   │   └── errorHandler.ts
│   ├── utils/           # Utility functions
│   │   └── logger.ts
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── tests/
│   ├── unit/            # Unit tests
│   │   ├── userService.test.ts
│   │   ├── errorHandler.test.ts
│   │   └── logger.test.ts
│   └── integration/     # Integration tests
│       └── userRoutes.test.ts
├── docs/
│   └── openapi.yaml     # OpenAPI 3.0 specification
├── dist/                # Compiled JavaScript (generated)
├── coverage/            # Test coverage reports (generated)
└── node_modules/        # Dependencies (generated)
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `NODE_ENV` | Environment (development/production) | `development` | No |
| `LOG_LEVEL` | Logging level (ERROR/WARN/INFO/DEBUG) | `info` | No |

### TypeScript Configuration

The project uses strict TypeScript configuration:
- Strict mode enabled
- No implicit any
- Strict null checks
- No unused locals/parameters

## 🛡️ Security Features

- **Helmet**: Security headers (XSS protection, content security policy, etc.)
- **CORS**: Cross-Origin Resource Sharing support
- **Input Validation**: Comprehensive validation with Zod
- **Error Handling**: Safe error messages (no stack traces in production)

## 📝 Logging

The API uses structured logging with configurable log levels:

```typescript
// Log levels (in order of severity)
ERROR   // Critical errors only
WARN    // Warnings and errors
INFO    // General information (default)
DEBUG   // Detailed debugging information
```

Set the log level via the `LOG_LEVEL` environment variable.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
NODE_ENV=production npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
This project follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Validation with [Zod](https://zod.dev/)
- Testing with [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest)
- Documentation with [Swagger UI](https://swagger.io/tools/swagger-ui/)

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using TypeScript and Express**
