import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MapboxMapComponentWithAuth from '../components/MapboxMapComponentWithAuth';

export default function ProjectDetails() {
  const { id } = useParams();

  return (
    <>
      <div className="mb-6">
        <Link to="/projects" className="text-sm text-slate-500 hover:text-emerald-600">
          ← Back to projects
        </Link>

        <h1 className="text-2xl font-semibold mt-2">Project #{id}</h1>

        <p className="text-sm text-slate-500 mt-1">Manage sites and draw project boundaries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 card overflow-hidden h-[75vh]">
          <MapboxMapComponentWithAuth projectId={id} />
        </div>

        <div className="card p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Add Sites</h3>
            <p className="text-sm text-slate-500 mt-1">
              Use the map tools to draw site boundaries.
            </p>
          </div>

          <ul className="text-sm text-slate-600 list-disc pl-4 space-y-1">
            <li>Select the polygon tool</li>
            <li>Draw site boundary</li>
            <li>Polygon saves automatically</li>
          </ul>
        </div>
      </div>
    </>
  );
}
