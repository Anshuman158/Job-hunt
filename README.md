# Job Hunt - MERN Job Portal Platform

A full-stack, responsive Job Portal application built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

### Candidate / Job Seeker Experience
- **Interactive Home Page**: Hero search banner, category carousels, and latest job postings.
- **Job Discovery & Search**: Filter jobs by location, salary range (0-15 LPA, 15-30 LPA, 30-50 LPA), role, and search keywords.
- **Detailed Job Views**: Overview with company information, salary, openings, requirements, and application status.
- **One-Click Job Application**: Quick apply flow with real-time feedback and status tracking.
- **Applicant Profile**: Edit profile, update bio, add skills, and upload resume PDF.
- **Application History**: View all applied positions with real-time status badges (Pending, Accepted, Rejected).

### Recruiter Experience
- **Company Management**: Register and configure multiple company profiles with logos, locations, descriptions, and websites.
- **Job Management**: Publish new job listings with openings, experience requirements, salary (LPA), and descriptions.
- **Applicant Review Dashboard**: Review candidates who applied for each job, inspect contact details and resumes, and accept or reject applications with one click.

---

## Demo Accounts

Pre-configured credentials ready to log in immediately:

| Role | Email | Password |
|------|-------|----------|
| **Job Seeker (Candidate)** | `patel@gmail.com` | `password123` |
| **Recruiter (Admin)** | `shivani@gmail.com` | `password123` |

*(Quick demo login buttons are also available directly on the `/login` page for 1-click fill!)*

---

## Project Structure

```
├── backend/
│   ├── controllers/      # Application, Company, Job, and User business logic
│   ├── middlewares/      # JWT authentication and Multer file upload
│   ├── models/           # Mongoose schemas (User, Company, Job, Application)
│   ├── routes/           # REST API endpoints (/api/v1/...)
│   ├── utils/            # DB connection, mockStore in-memory fallback, DataURI
│   ├── index.js          # Express server entry point
│   └── seed.js           # Database seeder script
└── frontend/
    ├── src/
    │   ├── components/   # Home, Jobs, Auth, Profile, Admin, and Shared UI
    │   ├── context/      # AuthContext, JobContext, CompanyContext, ToastContext
    │   ├── utils/        # Constants and API endpoint configurations
    │   ├── App.jsx       # Client routing with role-based Protected Routes
    │   └── main.jsx      # Root provider orchestration
    ├── index.html
    └── vite.config.js
```

---

## Getting Started

### 1. Backend Server

```bash
cd backend
npm install
npm run dev
# Server will start on http://localhost:8000
```

> **Note**: If a local MongoDB instance is not detected, the backend automatically runs with its built-in in-memory fallback store containing pre-seeded jobs, companies, and test accounts.

### 2. Frontend Application

```bash
cd frontend
npm install
npm run dev
# Frontend will be live on http://localhost:5173
```

