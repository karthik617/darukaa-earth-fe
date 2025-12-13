import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useAuth } from '../hooks/useAuth';
import KpiCard from '../components/KpiCard';

export default function SiteAnalytics() {
  const { id } = useParams();
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
        const siteRes = await authApi.get(`/geo/sites/${id}`);
        setSite(siteRes.data);

        const res = await authApi.get(`/geo/sites/${id}/analytics`, {
          params: { months },
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, months]);

  if (loading) {
    return (
      <>
        <div className="card p-6 text-center text-slate-500">Loading analytics…</div>
      </>
    );
  }

  if (!analytics || !site) {
    return (
      <>
        <div className="card p-6 text-center text-slate-500">No analytics available</div>
      </>
    );
  }

  const parseSeries = (arr) =>
    arr.map((pt) => {
      const d = new Date(pt.date);
      return [Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), Number(pt.value)];
    });

  const carbonSeries = parseSeries(analytics.carbon);
  const bioSeries = parseSeries(analytics.biodiversity_index);

  const chartOptions = {
    chart: { zoomType: 'x' },
    title: { text: null },
    xAxis: { type: 'datetime' },
    yAxis: [
      {
        title: { text: 'Carbon (tons / month)' },
      },
      {
        title: { text: 'Biodiversity Index' },
        opposite: true,
      },
    ],
    tooltip: { shared: true },
    series: [
      { name: 'Carbon', data: carbonSeries, type: 'line', yAxis: 0 },
      { name: 'Biodiversity', data: bioSeries, type: 'line', yAxis: 1 },
    ],
    credits: { enabled: false },
  };

  const latestCarbon = analytics.carbon.at(-1)?.value ?? '—';
  const latestBio = analytics.biodiversity_index.at(-1)?.value ?? '—';

  return (
    <>
      <div className="mb-6">
        <Link
          to={`/projects/${site.project_id}`}
          className="text-sm text-slate-500 hover:text-emerald-600"
        >
          ← Back to project
        </Link>

        <h1 className="text-2xl font-semibold mt-2">{site.name}</h1>

        <p className="text-sm text-slate-500 mt-1 max-w-2xl">{site.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Latest Carbon (t/mo)" value={latestCarbon} />
        <KpiCard label="Biodiversity Index" value={latestBio} />
        <KpiCard label="Tracking Period" value={`${months} months`} />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Environmental Performance</h3>
            <p className="text-sm text-slate-500">Monthly trend analysis</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Range</label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="input w-24"
            >
              <option value={6}>6 mo</option>
              <option value={12}>12 mo</option>
              <option value={24}>24 mo</option>
            </select>
          </div>
        </div>

        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </>
  );
}
