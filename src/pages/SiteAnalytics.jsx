import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useAuth } from '../auth/AuthProvider';
import KpiCard from '../components/KpiCard';

export default function SiteAnalytics() {
  const { id } = useParams(); // site id
  const { authApi } = useAuth();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [site, setSite] = useState(null);
  const [months, setMonths] = useState(12);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        // fetch site details (geom, name, description)
        const siteRes = await authApi.get(`/sites/${id}`);
        setSite(siteRes.data);

        // fetch analytics timeseries
        const res = await authApi.get(`/sites/${id}/analytics`, { params: { months } });
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, authApi, months]);

  if (loading) {
    return (<div className="p-6">Loading analytics…</div>);
  }

  if (!analytics || !site) {
    return (<div className="p-6">No analytics available.</div>);
  }

  // Prepare series for Highcharts
  const parseSeries = (arr) => {
    // arr: [{date:"YYYY-MM-DD", value: number}] -> [ [Date.UTC(...), value], ... ]
    return arr.map(pt => {
      const d = new Date(pt.date);
      return [Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), Number(pt.value)];
    });
  };

  const carbonSeries = parseSeries(analytics.carbon);
  const bioSeries = parseSeries(analytics.biodiversity_index);

  const chartOptions = {
    chart: { zoomType: 'x' },
    title: { text: `Site Analytics — ${site.name || 'Site ' + id}` },
    xAxis: { type: 'datetime' },
    yAxis: [{ // primary yAxis
      labels: { format: '{value}' },
      title: { text: 'Carbon (tons/month)' }
    }, { // secondary yAxis
      title: { text: 'Biodiversity Index' },
      labels: { format: '{value}' },
      opposite: true
    }],
    tooltip: { shared: true },
    series: [
      { name: 'Carbon (tons/month)', data: carbonSeries, type: 'line', yAxis: 0 },
      { name: 'Biodiversity Index', data: bioSeries, type: 'line', yAxis: 1 }
    ],
    responsive: { rules: [{ condition: { maxWidth: 600 }, chartOptions: { legend: { enabled: false } } }] },
    credits: { enabled: false },
  };

  // KPI values (latest points)
  const latestCarbon = analytics.carbon.length ? analytics.carbon[analytics.carbon.length - 1].value : null;
  const latestBio = analytics.biodiversity_index.length ? analytics.biodiversity_index[analytics.biodiversity_index.length - 1].value : null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link to={`/projects/${site.project_id}`} className="text-sm">&larr; Back</Link>
          <h1 className="text-2xl font-semibold mt-2">{site.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{site.description}</p>
        </div>
        <div className="flex gap-4">
          <KpiCard label="Latest Carbon (t/mo)" value={latestCarbon ?? '—'} />
          <KpiCard label="Biodiversity Index" value={latestBio ?? '—'} />
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-600">Monthly timeseries (last {months} months)</div>
          <div>
            <label className="mr-2 text-sm">Months</label>
            <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className="border rounded px-2 py-1">
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>

        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
}
