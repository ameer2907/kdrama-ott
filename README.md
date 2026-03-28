# 🎬 KDramaVerse — Netflix-Style Korean Drama OTT Platform

A full-stack, portfolio-grade OTT web application for Korean drama trailers. Built with the **MERN stack** (MongoDB, Express.js, React, Node.js), featuring a Netflix-dark UI, multi-language support (EN/KO/TA/ML), JWT auth, admin dashboard, and AI-style recommendations.

---

## 🗂️ Project Structure

```
kdrama-ott/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       ← register, login, getMe, updateProfile
│   │   ├── seriesController.js     ← CRUD + TMDB import + recommendations
│   │   ├── favoritesController.js  ← add/remove/check favorites
│   │   ├── historyController.js    ← watch history CRUD
│   │   └── adminController.js      ← dashboard stats, user management
│   ├── middleware/
│   │   └── auth.js                 ← protect, adminOnly, optionalAuth
│   ├── models/
│   │   ├── User.js                 ← users collection
│   │   ├── Series.js               ← series collection
│   │   └── Activity.js             ← activity/analytics collection
│   ├── routes/
│   │   ├── auth.js, series.js, favorites.js
│   │   ├── history.js, admin.js, users.js
│   ├── utils/
│   │   └── seeder.js               ← seeds 30 dramas + admin/demo users
│   ├── server.js
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── SeriesCard.jsx   ← hover zoom, trailer play, fav btn
    │   │   │   ├── SeriesRow.jsx    ← horizontal scroll row
    │   │   │   └── SkeletonCard.jsx ← shimmer loading
    │   │   ├── home/
    │   │   │   ├── HeroBanner.jsx   ← auto-slider hero with trailer btn
    │   │   │   └── TrailerModal.jsx ← YouTube embed + multi-lang + download
    │   │   └── layout/
    │   │       ├── Navbar.jsx       ← scroll-aware, lang switcher, user menu
    │   │       ├── Layout.jsx
    │   │       └── Footer.jsx
    │   ├── context/
    │   │   └── authStore.js         ← Zustand store for auth state
    │   ├── pages/
    │   │   ├── Home.jsx             ← hero + genre rows
    │   │   ├── SeriesDetail.jsx     ← full detail, cast, trailer, recs
    │   │   ├── Search.jsx           ← search + filter + sort
    │   │   ├── Login.jsx            ← auth page
    │   │   ├── Register.jsx         ← auth page
    │   │   ├── Profile.jsx          ← edit profile, watch history, password
    │   │   ├── Favorites.jsx        ← saved dramas grid
    │   │   ├── AdminDashboard.jsx   ← full admin panel
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   └── api.js               ← Axios instance + all API calls
    │   ├── utils/
    │   │   └── i18n.js              ← EN / KO / TA / ML translations
    │   ├── styles/
    │   │   └── index.css            ← Tailwind + custom CSS
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── vite.config.js
    ├── tailwind.config.js
    └── vercel.json
```

---

## 🔑 API Routes Reference

### Auth  `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Create account |
| POST | `/login` | — | Sign in, returns JWT |
| GET | `/me` | ✅ | Get current user |
| PUT | `/profile` | ✅ | Update profile |
| PUT | `/change-password` | ✅ | Change password |

### Series  `/api/series`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | All series (paginated, filterable) |
| GET | `/featured` | — | Featured banner series |
| GET | `/trending` | — | Trending series |
| GET | `/by-genre` | — | Series grouped by genre |
| GET | `/search?q=&genre=&year=` | — | Full-text search + filters |
| GET | `/:id` | opt | Series detail (increments views) |
| GET | `/:id/recommendations` | — | AI-style similar series |
| POST | `/:id/trailer-view` | opt | Track trailer play |
| POST | `/` | 🔒 Admin | Create series |
| PUT | `/:id` | 🔒 Admin | Update series |
| DELETE | `/:id` | 🔒 Admin | Delete series |
| POST | `/tmdb/:tmdbId` | 🔒 Admin | Import from TMDB API |

### Favorites  `/api/favorites`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ | Get all favorites |
| GET | `/check/:seriesId` | ✅ | Is this favorited? |
| POST | `/:seriesId` | ✅ | Add to favorites |
| DELETE | `/:seriesId` | ✅ | Remove from favorites |

### History  `/api/history`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ | Get watch history |
| POST | `/` | ✅ | Add to history |
| DELETE | `/` | ✅ | Clear all history |
| DELETE | `/:seriesId` | ✅ | Remove one entry |

### Admin  `/api/admin`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/dashboard` | 🔒 Admin | Full analytics stats |
| GET | `/users` | 🔒 Admin | All users |
| PUT | `/users/:id/toggle` | 🔒 Admin | Suspend / activate user |
| DELETE | `/users/:id` | 🔒 Admin | Delete user |
| POST | `/series/bulk-import` | 🔒 Admin | Bulk import series JSON |

---

## 🚀 Local Setup & Run Instructions

### Prerequisites
- **Node.js** v18+
- **MongoDB Atlas** account (free tier works)
- **TMDB API key** (optional, for importing dramas)

---

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd kdrama-ott

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

---

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/kdrama-ott
JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRE=30d
TMDB_API_KEY=your_tmdb_api_key_here
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=ameermalikbahad07@gmail.com
NODE_ENV=development
```

> **Get MongoDB URI:** Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas) → Connect → Driver → copy the URI  
> **Get TMDB Key:** Register at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

---

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- **30+ Korean drama** series with posters, trailers, cast, genres
- **Admin account:** `ameermalikbahad07@gmail.com` / `Admin@123`
- **Demo user:** `demo@kdrama.com` / `Demo@123`

---

### 4. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 5. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev
# → Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend && npm run dev
# → Runs on http://localhost:5173
```

Open **http://localhost:5173** 🎉

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
```

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy ✅

### Backend → Render

1. Create new **Web Service** on [render.com](https://render.com)
2. Connect GitHub repo, set **Root Directory** to `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `node server.js`
5. Add all environment variables from `.env`
6. Deploy ✅

### Database → MongoDB Atlas

- Already configured via `MONGODB_URI`
- Add your Render server IP to Atlas **Network Access** (or use `0.0.0.0/0`)

---

## 🌍 Multi-Language Support

The app supports 4 languages via **react-i18next**:

| Code | Language | Coverage |
|------|----------|---------|
| `en` | English | Full UI + Series descriptions |
| `ko` | Korean (한국어) | Full UI + Korean titles |
| `ta` | Tamil (தமிழ்) | Full UI + Tamil descriptions |
| `ml` | Malayalam (മലയാളം) | Full UI + Malayalam descriptions |

Users can switch language in the Navbar globe icon. Preference is saved to `localStorage` and synced to user profile.

---

## 🎬 Features At-a-Glance

| Feature | Details |
|---------|---------|
| 🏠 Hero Banner | Auto-sliding featured dramas, 7s interval, pause on hover |
| 🎥 Trailer Player | YouTube embedded inside app (no redirect), multi-language |
| ⬇️ Download Trailers | One-click download option for each trailer |
| 🔍 Search & Filter | Full-text search + genre/year/sort filters |
| ❤️ Favorites | Add/remove, persisted per user account |
| 📜 Watch History | Tracks every series viewed, clearable |
| 🤖 Recommendations | Genre + year-based similar series (AI-style) |
| 🔐 JWT Auth | bcrypt passwords, 30-day tokens, protected routes |
| 👑 Admin Dashboard | Stats, CRUD series, user management, analytics charts |
| 📊 Analytics | Daily activity, genre distribution, top series |
| 🌐 TMDB Integration | Import any K-drama by TMDB ID in one click |
| 📱 Responsive | Mobile-first, works on all screen sizes |
| ✨ Animations | Framer Motion throughout (hero, cards, modals) |
| 💀 Skeletons | Shimmer loading on all content rows |

---

## 👤 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | ameermalikbahad07@gmail.com | Admin@123 |
| Demo User | demo@kdrama.com | Demo@123 |

---

## 🔒 Security Notes

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens expire in **30 days**
- Rate limiting: **100 requests / 15 min** per IP
- Helmet.js security headers enabled
- CORS restricted to frontend origin
- Admin routes protected by role middleware

---

## 🎭 30+ Included K-Dramas

Crash Landing on You · Goblin · Itaewon Class · Vincenzo · My Love from the Star · Descendants of the Sun · Extraordinary Attorney Woo · Squid Game · Mr. Queen · Twenty-Five Twenty-One · Kingdom · Reply 1988 · Hotel Del Luna · Juvenile Justice · My Mister · The Glory · Flower of Evil · Weightlifting Fairy Kim Bok-joo · Healer · Business Proposal · Doctor Stranger · Strong Woman Do Bong-soon · Signal · Pinocchio · Arthdal Chronicles · Hometown Cha-Cha-Cha · A Korean Odyssey · Lovers of the Red Sky · Hellbound · All of Us Are Dead · Mouse · Nevertheless

---

## 📦 Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS · Framer Motion · React Query · Zustand · React Player · i18next · Lucide Icons

**Backend:** Node.js · Express.js · Mongoose · JWT · bcryptjs · Helmet · Morgan · Express Validator · Rate Limit

**Database:** MongoDB Atlas (3 collections: users, series, activity)

**Deploy:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database)
