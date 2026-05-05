# TalentDesk Platform Tech Test (Made by Syed Shad)

A full-stack web application with a React frontend and an Express backend. Users can submit a form with a name, message, and file upload. The backend validates the input and stores the uploaded file on disk.

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 19, Vite, CSS                             |
| Backend  | Node.js, Express 5, Multer                      |
| Testing  | Vitest, React Testing Library, Supertest        |
| Linting  | ESLint (Airbnb config)                          |

---

## Project Structure

```
platform-tech-test/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server & API routes
│   │   └── index.test.js     # Backend API tests (Supertest)
│   ├── uploads/              # Uploaded files are stored here
│   └── vitest.config.js      # Vitest config for backend
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main form component
│   │   ├── App.css           # App styles
│   │   ├── App.test.jsx      # Frontend component tests
│   │   ├── main.jsx          # React entry point
│   │   └── test-setup.js     # Vitest/jsdom setup
│   ├── index.html
│   └── vite.config.js        # Vite + proxy config for frontend
├── .env.example              # Environment variable template
├── .eslintrc.cjs             # ESLint configuration
├── package.json              # Root scripts and dependencies
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (see `.nvmrc` for the recommended version)
- npm

### Installation

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Install dependencies
npm install
```

### Environment Variables

| Variable       | Default | Description              |
|----------------|---------|--------------------------|
| `BACKEND_PORT` | `5003`  | Port the Express API runs on |
| `FRONTEND_PORT`| `3000`  | Port the Vite dev server runs on |

### Running the App

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 — Backend (Express, auto-restarts with nodemon)
npm run start-backend

# Terminal 2 — Frontend (Vite dev server with API proxy)
npm run start-frontend
```

The frontend will be available at `http://localhost:3000`. API requests to `/api/*` and `/uploads/*` are automatically proxied to the backend.

---

## API

### `POST /api/submit`

Accepts a `multipart/form-data` request with the following fields:

| Field     | Type   | Validation                          |
|-----------|--------|-------------------------------------|
| `name`    | string | Required, 2–80 characters           |
| `message` | string | Required, 10–500 characters         |
| `file`    | file   | Required, max 5 MB                  |

**Success response `201`:**
```json
{
  "name": "Ada Lovelace",
  "message": "This is my message.",
  "file": {
    "originalName": "document.pdf",
    "path": "/uploads/1700000000000-document.pdf",
    "size": 12345
  }
}
```

**Validation error response `400`:**
```json
{
  "message": "Validation failed.",
  "errors": {
    "name": "Name is required.",
    "message": "Message must be at least 10 characters.",
    "file": "A file is required."
  }
}
```

### `GET /uploads/:filename`

Serves uploaded files statically from the `backend/uploads/` directory.

---

## Testing

```bash
# Run all tests (frontend + backend)
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend
```

---

## Linting

```bash
# Check for lint errors
npm run lint

# Auto-fix lint errors
npm run lint:fix
```


## Assignment

We have provided a basic application, where a form submits and the back-end returns what has been submitted.

Make the following changes:

1. Add styling to the form
2. Add selecting a file to the form, this should be stored in a directory in the back-end and the path to the file returned to the front-end on submission. Selecting the file should support drag and drop
3. Add validation to the form
4. Add linting to the application, following AirBnb's linting rules
5. Add front-end and back-end tests to the application

You may add any relevant 3rd party libraries. Please explain why you have chosen them.

## Bonus  I can make and integration with sonnet AI but after deploy Netlify not working

Add an AI agent method (e.g. a Claude Code skill) to run linting and automatically fix any issues found
