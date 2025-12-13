import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetails from "./pages/ProjectDetails";
import SiteAnalytics from "./pages/SiteAnalytics";
import { useAuth } from "./auth/AuthProvider";
import Layout from "./components/Layout";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/projects"
        element={
          <Protected>
            <ProjectsPage />
          </Protected>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <Protected>
            <ProjectDetails />
          </Protected>
        }
      />
      <Route
        path="/sites/:id"
        element={
          <Protected>
            <SiteAnalytics />
          </Protected>
        }
      />
      <Route path="/" element={<Navigate to="/projects" />} />
    </Routes>
  );
}
