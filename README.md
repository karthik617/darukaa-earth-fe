# Darukaa.Earth – Frontend (React)

## Overview

This is the frontend for **Darukaa.Earth**, a geospatial analytics dashboard for managing carbon and biodiversity projects. It consumes the FastAPI backend and provides an intuitive UI for authentication, project management, geospatial site creation, and analytics visualization.

---

## Tech Stack

* **Framework**: React (Vite)
* **Styling**: Tailwind CSS
* **Maps**: MapLibre GL JS + Mapbox Draw
* **Charts**: Highcharts
* **Auth**: JWT (with refresh token rotation)
* **HTTP**: Axios
* **Routing**: React Router

---

## Application Structure

```
src/
 ├── auth/
 │   ├── AuthProvider.jsx
 │   ├── AuthContext.js
 ├── components/
 │   ├── MapboxMapComponentWithAuth.jsx
 │   ├── KpiCard.jsx
 │   ├── Layout.jsx
 ├── pages/
 │   ├── Login.jsx
 │   ├── Register.jsx
 │   ├── ProjectsPage.jsx
 │   ├── ProjectDetails.jsx
 │   ├── SiteAnalytics.jsx
 ├── App.jsx
 └── main.jsx
```

---

## Key Features

### Authentication

* Login & registration
* JWT access token with automatic refresh
* Protected routes

### Project Management

* Create and list projects
* Navigate into project details

### Geospatial Sites

* Interactive Mapbox map
* Draw polygons using Mapbox Draw
* Save sites to backend (GeoJSON)
* Display saved sites on map

### Analytics

* Highcharts timeseries
* Carbon & biodiversity KPIs
* Adjustable time range

---

## Environment Variables

Create `.env` file:

```
VITE_API_BASE=http://localhost:8000
```

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repo-url>
cd darukaa-earth-fe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

App available at: `http://localhost:5175`

---

## CI/CD & Code Quality

* Husky pre-commit hooks
* lint-staged + Prettier
* ESLint enforcement
* GitHub Actions build check

---

## Deployment

* Deployed on Render
* Environment variables configured via platform dashboard

---

## Notes for Reviewers

* Analytics data is mock-generated for demo
* Strong separation of concerns (auth, data, UI)

