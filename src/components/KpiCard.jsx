import React from 'react';

export default function KpiCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-sm px-4 py-3 w-48">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
