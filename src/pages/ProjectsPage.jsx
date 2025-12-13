import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProjectsPage() {
  const { authApi } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    authApi.get('/geo/projects').then((res) => setProjects(res.data));
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    await authApi.post('/geo/projects', { name, description: desc });
    const res = await authApi.get('/geo/projects');
    setProjects(res.data);
    setName('');
    setDesc('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
      </div>

      <form onSubmit={createProject} className="card p-4 mb-6 flex gap-4">
        <input
          className="input flex-1"
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input flex-1"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="btn-primary">Create</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p.id} to={`/projects/${p.id}`} className="card p-5 hover:shadow-md transition">
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{p.site_count} sites</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
