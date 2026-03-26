# VideoTube — Full Stack Setup Guide

## Project Structure

```
your-project/
├── src/                        ← Your existing backend
│   ├── app.js                  ← REPLACE with the new app.js
│   ├── controllers/            ← Use the generated controllers
│   ├── routes/                 ← Use updated user_routes.js
│   └── ...
└── videotube-frontend/         ← Extract this zip here
    ├── package.json
    ├── vite.config.js          ← Proxies /api → localhost:8000
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── layout/         Header, Sidebar
        │   ├── video/          VideoCard, UploadModal
        │   ├── comment/        CommentSection
        │   └── ui/             ProtectedRoute
        ├── pages/
        │   ├── Home.jsx        Feed with featured hero video
        │   ├── Watch.jsx       Video player + comments + related
        │   ├── Channel.jsx     Channel profile (videos/tweets/about)
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx   Channel stats + video management
        │   ├── Settings.jsx    Profile, avatar, password
        │   ├── Explore.jsx     Browse all with sort controls
        │   ├── Search.jsx      Search results
        │   └── misc.jsx        LikedVideos, WatchHistory, Playlists, Tweets
        ├── services/
        │   ├── api.js          Axios instance + auto token refresh
        │   └── index.js        All API calls (auth, video, comment, like, sub, playlist, tweet, dashboard)
        ├── store/
        │   └── authStore.js    Zustand auth state
        └── utils/
            └── helpers.js      formatViews, timeAgo, formatDuration

## Setup Steps

### 1. Backend — replace app.js
Copy the new `app.js` into your `src/` folder. It registers all 8 routers:
  /api/v1/users, /api/v1/videos, /api/v1/comments, /api/v1/likes,
  /api/v1/subscriptions, /api/v1/playlists, /api/v1/tweets, /api/v1/dashboard

### 2. Backend — fix middleware import paths
Your backend has TWO different import styles. Standardize to:
  import { upload }     from "../middlewares/multer.middleware.js"
  import { verifyJWT }  from "../middlewares/auth.middleware.js"
(Note: middlewares plural, not middleware)

### 3. Backend .env — add CORS origin
  CORS_ORIGIN=http://localhost:3000

### 4. Frontend — install & run
  cd videotube-frontend
  npm install
  npm run dev          # runs on http://localhost:3000

### 5. Backend — start your server
  npm run dev          # must run on port 8000

The Vite dev server proxies all /api/* calls to http://localhost:8000
so there are zero CORS issues during development.

## Pages & Features

| Page        | Route                  | Auth? | What it does                                    |
|-------------|------------------------|-------|-------------------------------------------------|
| Home        | /                      | No    | Feed, category filter, featured hero video      |
| Explore     | /explore               | No    | All videos with sort (newest/views/oldest)      |
| Watch       | /watch/:id             | No    | Player, like, subscribe, comments, related      |
| Channel     | /channel/:username     | No    | Profile, videos tab, tweets tab, about tab      |
| Search      | /search?q=             | No    | Search results                                  |
| Login       | /login                 | No    | Sign in                                         |
| Register    | /register              | No    | Sign up with avatar/cover upload                |
| Dashboard   | /dashboard             | Yes   | Stats cards, video table (toggle/delete)        |
| Settings    | /settings              | Yes   | Update profile, avatar, cover, password         |
| Liked       | /liked                 | Yes   | All liked videos                                |
| History     | /history               | Yes   | Watch history                                   |
| Playlists   | /playlists             | Yes   | Create & view playlists                         |
| Tweets      | /tweets                | Yes   | Post, edit, delete tweets                       |

## Design System

- **Theme**: Dark cinematic — black base (#080808), electric lime accent (#e8ff47)
- **Fonts**: Bebas Neue (display/headings) + DM Sans (body) + JetBrains Mono (code/meta)
- **Motion**: CSS fade-up animations, skeleton loaders, hover scale on thumbnails
- **Layout**: Sticky header + fixed sidebar grid, responsive collapse at 900px

## Token Handling

Access tokens are stored in `localStorage` and attached via `Authorization: Bearer`.
On a 401, the axios interceptor auto-calls `/api/v1/users/refresh-token` using
the httpOnly refresh cookie, updates the stored token, and retries the original request.
