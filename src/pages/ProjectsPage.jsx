import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const { authApi, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const nav = useNavigate();

  const load = async () => {
    try {
      const res = await authApi.get("/geo/projects");
      setProjects(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await authApi.post("/geo/projects", { name, description: desc });
      setName(""); setDesc("");
      load();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2>Projects</h2>
      </div>

      <form onSubmit={create} style={{ marginBottom: 20 }}>
        <input placeholder="Project name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <button type="submit">Create</button>
      </form>

      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <Link to={`/projects/${p.id}`}>{p.name}</Link> — {p.site_count} sites
          </li>
        ))}
      </ul>
    </div>
  );
}
