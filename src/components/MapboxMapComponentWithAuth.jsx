import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAuth } from "../auth/AuthProvider";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

export default function MapboxMapComponentWithAuth({ projectId }) {
  const { authApi } = useAuth();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const [siteList, setSiteList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [nameInput, setNameInput] = useState("New Site");
  const [descInput, setDescInput] = useState("");

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [78.04, 9.92],
      zoom: 6,
    });

    const draw = new MapboxDraw({ displayControlsDefault: false, controls: { polygon: true, trash: true } });
    map.addControl(draw, "top-left");
    map.addControl(new mapboxgl.NavigationControl(), "top-left");

    map.on("load", () => {
      map.addSource("sites", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({ id: "sites-fill", type: "fill", source: "sites", paint: { "fill-color": "#0080ff", "fill-opacity": 0.3 } });
      map.addLayer({ id: "sites-line", type: "line", source: "sites", paint: { "line-color": "#0050aa", "line-width": 2 } });

      map.on("click", "sites-fill", async (e) => {
        const feature = e.features && e.features[0];
        if (!feature) return;
        const props = feature.properties || {};
        const html = `<div style="font-size:13px"><strong>${props.name || "Site"}</strong><div style="margin-top:6px">${props.description || ""}</div></div>`;
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
      });
    });

    mapRef.current = map;
    drawRef.current = draw;

    return () => map.remove();
  }, [authApi]);

  useEffect(() => { if (projectId) loadSites(); }, [projectId, authApi]);

  async function loadSites() {
    try {
      const res = await authApi.get(`/geo/projects/${projectId}/sites`);
      const fc = res.data;
      if (fc && fc.type === "FeatureCollection") {
        const map = mapRef.current;
        if (map && map.getSource("sites")) map.getSource("sites").setData(fc);
        const list = fc.features.map(f => ({ id: f.properties.id || f.properties.site_id, name: f.properties.name }));
        setSiteList(list);
      }
    } catch (e) {
      console.error("loadSites failed", e);
    }
  }

  async function saveDrawnSite() {
    if (!drawRef.current) return;
    const all = drawRef.current.getAll();
    if (!all.features.length) { alert("Draw polygon"); return; }
    const feature = all.features[0];
    feature.properties = feature.properties || {};
    feature.properties.name = nameInput;
    feature.properties.description = descInput;
    setSaving(true);
    try {
      await authApi.post(`/geo/projects/${projectId}/sites`, { name: nameInput, description: descInput, geojson: feature });
      await loadSites();
      drawRef.current.deleteAll();
      alert("Saved");
    } catch (e) {
      console.error("save failed", e);
      alert("Save failed");
    } finally { setSaving(false); }
  }

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ width: 300, padding: 12, borderRight: "1px solid #eee" }}>
        <h4>New Site</h4>
        <div><label>Name</label><input value={nameInput} onChange={e => setNameInput(e.target.value)} /></div>
        <div><label>Description</label><input value={descInput} onChange={e => setDescInput(e.target.value)} /></div>
        <div style={{ marginTop: 8 }}>
          <button onClick={saveDrawnSite} disabled={saving}>{saving ? "Saving..." : "Save drawn site"}</button>
          <button onClick={() => drawRef.current && drawRef.current.deleteAll()} style={{ marginLeft: 8 }}>Clear</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Sites</strong>
          <ul>
            {siteList.map(s => <li key={s.id}>{s.name}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div ref={mapContainer} style={{ width: "100%", height: 600 }} />
      </div>
    </div>
  );
}
