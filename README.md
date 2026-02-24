
<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js&theme=dark&perline=4" alt="Node.js, Express, MongoDB, JavaScript" />

**Built with Node.js, Express, MongoDB & JavaScript**
# MIS Demo

</div>

A fully developed backend repository for a School Management Information System (MIS) with database integration.

## Overview

MIS Demo is a comprehensive RESTful API built with Express.js and MongoDB for managing educational institutions. The system provides complete CRUD operations for schools, levels, classes, students, teachers, and courses, with JWT authentication, request validation, and API documentation via Swagger UI.

## How It Works

The application follows the MVC (Model-View-Controller) pattern with a modular structure:

**config/**: Database and application configuration
```javascript
// MongoDB connection, Swagger setup, environment configs
```

**controllers/**: Business logic for each entity
```javascript
// Handles requests and responses for schools, students, teachers, etc.
```

**models/**: MongoDB schemas with Mongoose
```javascript
// Defines data structure for User, School, Level, Class, Student, Teacher, Course
```

**routes/**: API endpoint definitions
```javascript
// Maps HTTP methods to controller functions
```

**middleware/**: Authentication and validation
```javascript
// JWT authentication, error handling, request validation
```

**validations/**: Joi schemas for input validation
```javascript
// Validates request data before processing
```

**frontend/**: Client interface for the API
```html
<!-- User interface to interact with the backend -->
```

### Core Functionality

1. **Authentication**: JWT-based user authentication and authorization
2. **School Management**: Create and manage educational institutions
3. **Academic Structure**: Organize levels (Senior 4, 5, 6) and classes
4. **Student Management**: Track student enrollment and information
5. **Teacher Management**: Manage teaching staff and assignments
6. **Course Management**: Define and organize curriculum courses
7. **API Documentation**: Interactive Swagger UI for testing endpoints

### The Request Flow

When a client makes an API request:
1. Request hits the appropriate route in the routes layer
2. Middleware validates authentication (JWT token)
3. Validation middleware checks request data with Joi schemas
4. Controller processes the request and interacts with models
5. Model performs database operations via Mongoose
6. Response is formatted and sent back to the client
7. Error handler catches any issues and returns appropriate error messages

### Key Concepts Demonstrated

- **RESTful API Design**: Clean, resource-based endpoints
- **MVC Architecture**: Separation of concerns across layers
- **JWT Authentication**: Secure token-based authentication
- **Request Validation**: Input sanitization with Joi
- **Mongoose ODM**: Schema-based MongoDB modeling
- **Error Handling**: Centralized error management
- **API Documentation**: Auto-generated Swagger docs
- **Logging**: Request logging with Morgan

## Installation

1. Clone the repository:
```bash
git clone https://github.com/achille010/mis-demo.git
cd mis-demo
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB:
```bash
# Make sure MongoDB is running on mongodb://localhost:27017
# Or update the connection string in config/default.json
```

4. Seed the database (optional):
```bash
npm run seed
# Creates default admin user:
# Username: admin
# Password: admin123
# Email: admin@school.com
```

5. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

6. Access the application:
```
API: http://localhost:3000
Swagger UI: http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
```bash
POST /api/v1/auth/login    # User login
POST /api/v1/auth/logout   # User logout
```

### Schools
```bash
GET    /api/v1/schools     # Get all schools
GET    /api/v1/schools/:id # Get school by ID
POST   /api/v1/schools     # Create school
PUT    /api/v1/schools/:id # Update school
DELETE /api/v1/schools/:id # Delete school
```

### Levels
```bash
GET    /api/v1/levels      # Get all levels
GET    /api/v1/levels/:id  # Get level by ID
POST   /api/v1/levels      # Create level
PUT    /api/v1/levels/:id  # Update level
DELETE /api/v1/levels/:id  # Delete level
```

### Classes, Students, Teachers, Courses
Similar CRUD endpoints available for each entity at `/api/v1/{entity}`

## Usage Examples

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Create School (Authenticated)
```bash
curl -X POST http://localhost:3000/api/v1/schools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Example High School",
    "address": "123 Main St",
    "email": "info@example.com",
    "principalName": "John Doe"
  }'
```

### Get All Students
```bash
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer <your-token>"
```

## Project Structure

```
mis-demo/
├── config/           # Configuration files
├── controllers/      # Business logic
├── frontend/         # Client interface
├── middleware/       # Auth & validation
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── scripts/          # Utility scripts
├── validations/      # Joi schemas
├── server.js         # Entry point
└── package.json      # Dependencies
```

## Authentication

Most endpoints require JWT authentication. Include the token in your requests:

```bash
# Using Authorization header
Authorization: Bearer <your-token>

# Or using x-auth-token header
x-auth-token: <your-token>
```

## Limitations

- Frontend is basic HTML/JS (could be upgraded to React)
- No email verification system
- Basic role management (admin only)
- No file upload functionality
- Limited reporting features

This is a demonstration project showcasing full-stack MIS architecture.

## Requirements

- Node.js 14 or higher
- MongoDB (local or remote)
- npm or yarn

## Future Enhancements

- Upgrade frontend to React
- Add role-based access control (RBAC)
- Implement attendance tracking
- Add grade management system
- File upload for documents
- Email notifications
- Advanced reporting and analytics

## Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests for improvements.

## License

ISC License - Read details from the LICENSE file

---

*Built as a comprehensive School Management Information System demonstrating full-stack backend development*