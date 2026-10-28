<div align="center">
  <br />
  <img src="https://api.iconify.design/lucide:briefcase.svg?color=%237c3aed" width="70" height="70" alt="Job Hunt Logo" />
  <h1>Job Hunt — Modern MERN Job Portal</h1>
  <p>A full-stack, responsive career platform connecting ambitious talent with top companies.</p>

  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Google%20OAuth-2.0-4285F4?logo=google&logoColor=white" alt="Google OAuth" />
  </p>
</div>

---

## 🌟 Key Features

### 👨‍🎓 For Candidates (Job Seekers)
- **Interactive Home Page**: Hero search, job categories carousel, and recently posted opportunities.
- **Job Discovery & Search**: Instant filter by role, location, salary range (0–15 LPA, 15–30 LPA, 30–50 LPA), or keyword.
- **Detailed Job Pages**: View role expectations, requirements, salary (LPA), openings, and company profiles.
- **One-Click Application**: Apply directly with immediate status updates and duplication checks.
- **Candidate Profile**: Custom bio, skill badges, resume preview/download, and avatar.
- **Application Tracking**: Live dashboard tracking application review statuses (**Pending**, **Accepted**, **Rejected**).

### 🏢 For Recruiters & Employers
- **Company Management**: Create and manage multiple corporate identities with logos, locations, websites, and descriptions.
- **Job Posting**: Publish job listings with required experience, openings count, salary tiers, and detailed specifications.
- **Applicant Review Dashboard**: Review every candidate who applied, view attached resumes, and mark status (**Accept** / **Reject**) in real-time.

### 🔐 Authentication & Security
- **Dual Authentication**: Traditional Email/Password authentication + **Google OAuth 2.0 ("Sign in with Google")**.
- **Role-Based Access Control**: Protected routes ensuring candidate and recruiter dashboards are segregated.
- **JWT & HTTP-Only Cookies**: Secure, stateless authentication with cross-origin cookie support.
- **Zero-Config DB Fallback**: Built-in mock store allowing full application functionality even without a local MongoDB daemon installed.

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend API will start on **`http://localhost:8000`**.

> **Note**: If MongoDB is not running locally, the server automatically starts with its built-in in-memory fallback store pre-populated with demo data.

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will start on **`http://localhost:3000`** (and is accessible on your local network).

---

## 🔑 Demo Credentials

To test the platform immediately without creating a new account:

| Role | Email | Password | Access / Dashboard |
|------|-------|----------|--------------------|
| **Job Seeker** | `patel@gmail.com` | `password123` | Browse jobs, apply, update profile |
| **Recruiter** | `shivani@gmail.com` | `password123` | Post jobs, manage companies, review applicants |

*(One-click autofill buttons for these accounts are also available directly on the login page!)*

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/jobhunt
SECRET_KEY=jobhunt_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:3000
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (`frontend/.env`)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── controllers/         # Application, Company, Job & User controllers
│   ├── middlewares/         # JWT verification (isAuthenticated) & Multer upload
│   ├── models/              # Mongoose models (User, Company, Job, Application)
│   ├── routes/              # REST API route handlers (/api/v1/...)
│   ├── utils/               # Database connection, mockStore, datauri helper
│   ├── index.js             # Express application entrypoint
│   └── seed.js              # Database seed script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/       # Recruiter views (Companies, Jobs, PostJob, Applicants)
│   │   │   ├── auth/        # Login & Signup with Google OAuth integration
│   │   │   ├── browse/      # Search results & keyword filtering
│   │   │   ├── home/        # HeroSection, CategoryCarousel, LatestJobs
│   │   │   ├── jobs/        # JobCard, JobDescription, FilterCard
│   │   │   ├── profile/     # Candidate profile, resume & applied jobs table
│   │   │   └── shared/      # Navbar, Footer, ProtectedRoute guard
│   │   ├── context/         # Auth, Company, Job & Toast React contexts
│   │   ├── utils/           # Endpoint constants & axios configurations
│   │   ├── App.jsx          # Declarative router with role-based routing
│   │   └── main.jsx         # GoogleOAuthProvider & root provider orchestration
│   ├── index.html           # HTML5 template
│   ├── tailwind.config.js   # Tailwind theme extensions & animations
│   └── vite.config.js       # Vite configuration (port 3000, host: true)
│
└── README.md
```

---

## 📡 API Reference

### User Routes (`/api/v1/user`)
- `POST /register` — Register a new student or recruiter account (supports avatar upload)
- `POST /login` — Authenticate with email, password, and role
- `GET /logout` — Invalidate session and clear auth cookie
- `POST /google-auth` — Authenticate / register via Google OAuth credential token
- `POST /profile/update` — Update candidate profile bio, skills, and resume PDF (Protected)

### Company Routes (`/api/v1/company`)
- `POST /register` — Register new company name (Protected, Recruiter)
- `GET /get` — List all companies registered by logged-in recruiter (Protected, Recruiter)
- `GET /get/:id` — Get detailed company metadata by ID (Protected)
- `PUT /update/:id` — Update company profile, description, website, location, and logo (Protected, Recruiter)

### Job Routes (`/api/v1/job`)
- `POST /post` — Post a new job opportunity (Protected, Recruiter)
- `GET /get?keyword=` — Search & retrieve all published jobs
- `GET /get/:id` — Get single job details with company & application data
- `GET /getadminjobs` — Get all jobs posted by the logged-in recruiter (Protected, Recruiter)

### Application Routes (`/api/v1/application`)
- `GET /apply/:id` — Apply to a job by ID (Protected, Candidate)
- `GET /get` — Retrieve all jobs applied to by the current user (Protected, Candidate)
- `GET /:id/applicants` — Retrieve all applicants for a specific job (Protected, Recruiter)
- `POST /status/:id/update` — Update application status (`accepted` or `rejected`) (Protected, Recruiter)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Axios, `@react-oauth/google`
- **Backend**: Node.js, Express 5, Mongoose 9, JSON Web Tokens (JWT), Bcrypt.js, `google-auth-library`, Multer, DataURI
- **Database**: MongoDB (with seamless in-memory fallback store for offline development)

---

## 📄 License

This project is licensed under the MIT License — feel free to use, customize, and extend it for your own projects!
