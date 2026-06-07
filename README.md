# LearnHub

A full-stack MERN (MongoDB, Express, React, Node.js) application.

## Project Structure

```
LearnHub/
├── client/                  # React Frontend (Vite)
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API service functions
│   │   ├── styles/          # Global & module CSS
│   │   ├── utils/           # Utility/helper functions
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── server/                  # Express Backend
│   ├── config/              # DB & app configuration
│   ├── controllers/         # Route handler logic
│   ├── middleware/           # Custom middleware
│   ├── models/              # Mongoose schemas/models
│   ├── routes/              # Express route definitions
│   ├── utils/               # Utility/helper functions
│   ├── validators/          # Request validation schemas
│   ├── server.js            # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd LearnHub
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy .env.example files and fill in your values
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

### Running the App

**Start the backend:**
```bash
cd server
npm run dev
```

**Start the frontend:**
```bash
cd client
npm run dev
```

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React, Vite, CSS    |
| Backend    | Node.js, Express    |
| Database   | MongoDB, Mongoose   |
| Auth       | JWT, bcrypt         |
"# CareerForge" 
