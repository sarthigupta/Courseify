<div align="center">

# Courseify

**Transform any YouTube playlist into a structured, Udemy-style learning experience.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/sarthigupta/Courseify?style=flat-square)](https://github.com/sarthigupta/Courseify/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/sarthigupta/Courseify?style=flat-square)](https://github.com/sarthigupta/Courseify/issues)

[Demo](#demo) · [Features](#features) · [Getting Started](#getting-started) · [Usage](#usage) · [Contributing](#contributing)

</div>

---

## What is Courseify?

Courseify takes any public YouTube playlist and turns it into a clean, structured learning experience — complete with chapter organization, progress tracking, and a distraction-free video player — all presented in a familiar course interface inspired by platforms like Udemy.

No more scrubbing through a raw playlist. Courseify gives your self-paced learning the structure it deserves.

---

## Features

- **Playlist to Course** — Paste any public YouTube playlist URL and instantly generate a structured course layout
- **Chapter Organization** — Videos are grouped into logical sections with numbered lectures
- **Progress Tracking** — Mark lectures as complete and track your overall course progress
- **Distraction-Free Player** — Clean, embedded video player without YouTube's recommendations sidebar
- **Course Dashboard** — Browse all your imported courses in one place
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile

---

## Demo

> https://courseify-blond.vercel.app/

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Styling | Tailwind CSS |
| Backend | Node.js / Express |
| Database | MongoDB |
| API | YouTube Data API v3 |
| Authentication | GoogleOAuth |

---

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A **YouTube Data API v3** key — [get one here](https://console.cloud.google.com/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sarthigupta/Courseify.git
cd Courseify
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `server/` directory.

Fill in the required values:

```env
YOUTUBE_API_KEY=your_youtube_data_api_v3_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Start the development servers

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm start
```

The app will be available at **`http://localhost:3000`**

---

## Usage

### Importing a YouTube Playlist

1. Copy the URL of any public YouTube playlist:
   ```
   https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxx
   ```
2. Paste it into the **"Create Course"** field on the dashboard
3. Courseify fetches all video metadata via the YouTube Data API and structures it as a course
4. Your new course appears on the dashboard — click to start learning

### Navigating a Course

- The right sidebar lists all lectures organized by section
- Click any lecture to load it in the main player
- Use **"Mark as Complete"** to track your progress
- Progress is saved automatically and synced to your account

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key for fetching playlist metadata |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign authentication tokens |
| `PORT` | No | Port for the backend server (default: `5000`) |
| `CLIENT_URL` | No | Frontend origin for CORS (default: `http://localhost:3000`) |

---

## Project Structure

```
Courseify/
├── frontend/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── pages/            # Route-level page components
│       ├── context/          # React context (auth, course state)
│       ├── hooks/            # Custom React hooks
│       └── utils/            # Helper functions
├── backend/                  # Node.js / Express backend
│   ├── controllers/          # Route logic
│   ├── models/               # Mongoose data models
│   ├── routes/               # API route definitions
│   ├── middleware/           # Auth guards, error handling
│   └── index.js              # Server entry point
└── README.md
```

---

## API Reference

### Courses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/courses` | 🔒 | Get all courses for the authenticated user |
| `POST` | `/api/courses/create-from-playlist` | 🔒 | Import a new playlist as a course |
| `GET` | `/api/courses/:id` | 🔒 | Get a single course with all lectures |
| `DELETE` | `/api/courses/:id` | 🔒 | Delete a course |

### Progress

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `PUT` | `/api/progress/update` | 🔒 | Mark a lecture as complete or incomplete |
| `GET` | `/api/progress/:courseId` | 🔒 | Get completion progress for a course |


## Roadmap

- [ ] Notes per lecture
- [ ] Course search and filtering
- [ ] Auto-chapter detection based on video titles
- [ ] Offline support with service workers
- [ ] Export course structure as PDF syllabus
- [ ] Public course sharing via shareable link

---

## Contributing

Contributions are welcome and encouraged!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and check [open issues](https://github.com/sarthigupta/Courseify/issues) before starting new work.

---



<div align="center">

Built with dedication by [Sarthi Gupta](https://github.com/sarthigupta) · Give it a ⭐ if you find it useful!

</div>
