import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
window.mapboxgl = maplibregl;
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useAuth } from '../hooks/useAuth';

export default function MapboxMapComponentWithAuth({ projectId }) {
  const { authApi } = useAuth();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const [siteList, setSiteList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [descInput, setDescInput] = useState('');

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: [78.04, 9.92],
      zoom: 6,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });
    map.addControl(draw, 'top-left');
    map.addControl(new maplibregl.NavigationControl(), 'top-left');

    map.on('load', () => {
      map.addSource('sites', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer(
        {
          id: 'sites-fill',
          type: 'fill',
          source: 'sites',
          paint: { 'fill-color': '#0080ff', 'fill-opacity': 0.3 },
        },
        'gl-draw-polygon-fill-inactive.cold'
      );
      map.addLayer(
        {
          id: 'sites-line',
          type: 'line',
          source: 'sites',
          paint: { 'line-color': '#0050aa', 'line-width': 2 },
        },
        'gl-draw-polygon-stroke-inactive'
      );

      map.on('click', 'sites-fill', async (e) => {
        e.preventDefault();
        const feature = e.features && e.features[0];
        if (!feature) return;
        const props = feature.properties || {};
        const html = `<div style="font-size:13px"><strong>${props.name || 'Site'}</strong><div style="margin-top:6px">${props.description || ''}</div></div>`;
        new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
      });
    });

    mapRef.current = map;
    drawRef.current = draw;

    return () => map.remove();
  }, [authApi]);

  useEffect(() => {
    if (projectId) loadSites();
  }, [projectId, authApi]);

  async function loadSites() {
    try {
      const res = await authApi.get(`/geo/projects/${projectId}/sites`);
      const fc = res.data;
      if (fc && fc.type === 'FeatureCollection') {
        const map = mapRef.current;
        if (map && map.getSource('sites')) map.getSource('sites').setData(fc);
        const list = fc.features.map((f) => ({ id: f.properties.id, name: f.properties.name }));
        setSiteList(list);
      }
    } catch (e) {
      console.error('loadSites failed', e);
    }
  }

  async function saveDrawnSite() {
    if (!drawRef.current) return;
    const all = drawRef.current.getAll();
    if (!all.features.length) {
      alert('Draw polygon');
      return;
    }
    const feature = all.features[0];
    feature.properties = feature.properties || {};
    feature.properties.name = nameInput;
    feature.properties.description = descInput;
    setSaving(true);
    try {
      await authApi.post(`/geo/projects/${projectId}/sites`, {
        name: nameInput,
        description: descInput,
        geojson: feature,
      });
      await loadSites();
      drawRef.current.deleteAll();
      setNameInput('');
      setDescInput('');
      alert('Saved');
    } catch (e) {
      console.error('save failed', e);
      setNameInput('');
      setDescInput('');
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 h-full">
      <div className="card p-3 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">New Site</h3>
          <p className="text-sm text-slate-500 mt-1">Draw a polygon and save it as a site.</p>
        </div>

        <div className="space-y-3">
          <input
            className="input"
            placeholder="Site name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <textarea
            className="input"
            placeholder="Description"
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={saveDrawnSite} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : 'Save Site'}
          </button>
          <button onClick={() => drawRef.current?.deleteAll()} className="btn-secondary">
            Clear
          </button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Sites</h4>
          <ul className="space-y-1 text-sm text-slate-600">
            {siteList.map((s) => (
              <li key={s.id} className="truncate">
                <Link
                  key={s.id}
                  to={`/sites/${s.id}`}
                  className="text-slate-800 hover:text-emerald-600"
                >
                  • {s.name}
                </Link>
              </li>
            ))}
            {!siteList.length && <li className="text-slate-400">No sites yet</li>}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-3 card overflow-hidden h-[75vh]">
        <div ref={mapContainer} style={{ width: '100%', height: 600 }} />
      </div>
    </div>
  );
}
