import React from 'react';

export default function KpiCard({ label, value }) {
  return (
    <div className="card px-5 py-4 w-52">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-slate-800 mt-2">{value}</div>
    </div>
  );
}
