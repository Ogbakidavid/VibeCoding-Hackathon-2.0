# FreelancersBot Pro

FreelancersBot Pro is an AI-powered platform for intelligent freelancer matching. It leverages advanced algorithms and Claude-style logic to connect clients with top-rated freelance professionals based on project requirements, skills, budget, and more.

## Features

- 🤖 **AI-Powered Matching:** Advanced Claude-inspired logic for skill, experience, and requirement matching.
- 🔍 **Intelligent Search:** Real-time freelancer search and recommendations.
- 🛡️ **Authentication:** Secure JWT-based authentication with bcrypt password hashing.
- 💳 **Subscription Tiers:** Free, Pro, and Enterprise plans with usage tracking and upgrade options.
- 📊 **Usage Analytics:** Track project usage and subscription limits.
- 🌐 **WebSocket Support:** Real-time updates for freelancer status and search.
- 💬 **Chat Interface:** Interactive chat for project requirement extraction and recommendations.
# FreelancersBot Pro

FreelancersBot Pro is an AI-powered platform for intelligent freelancer matching. It leverages advanced algorithms and Claude-style logic to connect clients with top-rated freelance professionals based on project requirements, skills, budget, and more.

## Features

- 🤖 **AI-Powered Matching:** Advanced Claude-inspired logic for skill, experience, and requirement matching.
- 🔍 **Intelligent Search:** Real-time freelancer search and recommendations.
- 🛡️ **Authentication:** Secure JWT-based authentication with bcrypt password hashing.
- 💳 **Subscription Tiers:** Free, Pro, and Enterprise plans with usage tracking and upgrade options.
- 📊 **Usage Analytics:** Track project usage and subscription limits.
- 🌐 **WebSocket Support:** Real-time updates for freelancer status and search.
- 💬 **Chat Interface:** Interactive chat for project requirement extraction and recommendations.

## Project Structure

```
backend/
  server.js
  routes/
  models/
  controllers/
  data/
  middleware/
  services/
  config/
frontend/
  src/
    pages/
    components/
    ui/
    services/
    constants/
  public/
  index.html
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- pnpm (or npm/yarn)
- (Optional) MongoDB or other DB if you want to persist users/freelancers

### Backend Setup

```sh
cd backend
pnpm install
cp .env.example .env   # Edit .env as needed
pnpm start             # or: node server.js
```

The backend runs on [http://localhost:5000](http://localhost:5000) by default.

### Frontend Setup

```sh
cd frontend
pnpm install
cp .env.example .env   # Edit .env as needed (set VITE_API_URL if backend is remote)
pnpm dev
```

The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

## API Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/health` — Health check
- `GET /api/freelancers` — List all freelancers
- `GET /api/freelancers/:id` — Get freelancer details
- `POST /api/match-freelancer` — Match freelancers to a project
- `POST /api/chat` — Claude-style chat for project matching
- `GET /api/subscription/tiers` — Get subscription tier info

## Technologies Used

- **Backend:** Node.js, Express, WebSocket, JWT, bcrypt
- **Frontend:** React, Vite, Axios, Tailwind CSS
- **AI Logic:** Custom Claude-inspired matching (see [`backend/services/aiService.js`](backend/services/aiService.js))

## Customization

- Add or edit freelancers in [`backend/data/sampleData.js`](backend/data/sampleData.js)
- Adjust matching logic in [`backend/services/aiService.js`](backend/services/aiService.js)
- Update subscription tiers and limits in constants

  ## 🚀 [View Live Demo Here](https://freelancersbot.netlify.app)

Experience the platform in action! Click the link above to try out the live demo.

## License

MIT License

---

Made with ❤️ for the Vibe Coding Hackathon
