# Project Architecture

## Overview

This is a full-stack application following a monorepo structure with separate backend and frontend directories.

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API + React Query (optional)

## Folder Structure
```
task-manager-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files (database, etc.)
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React Context
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
│
└── docs/                   # Documentation
```

## API Design

The backend follows RESTful principles:
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/tasks            - Get all tasks (authenticated)
POST   /api/tasks            - Create new task
GET    /api/tasks/:id        - Get single task
PUT    /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task
```

## Database Schema

### User
```typescript
{
  _id: ObjectId
  email: string (unique)
  password: string (hashed)
  name: string
  createdAt: Date
  updatedAt: Date
}
```

### Task
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: Date (optional)
  category: string (optional)
  createdAt: Date
  updatedAt: Date
}
```

## Authentication Flow

1. User registers/logs in
2. Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token in localStorage
5. Frontend sends token in Authorization header for protected routes
6. Backend verifies token via middleware

## Development Practices

- **TypeScript**: Strict mode enabled
- **Error Handling**: Centralized error handling middleware
- **Validation**: Input validation on both frontend and backend
- **Security**: Passwords hashed with bcrypt, JWT for auth, CORS configured
- **Code Quality**: ESLint + Prettier for consistent code style
```

---

### Paso 6: Actualizar .gitignore

Abre el archivo `.gitignore` y asegúrate de que contenga esto:
```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/

# Misc
*.tsbuildinfo