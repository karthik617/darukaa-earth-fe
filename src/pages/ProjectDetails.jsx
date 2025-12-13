import React from "react";
import { useParams, Link } from "react-router-dom";
import MapboxMapComponentWithAuth from "../components/MapboxMapComponentWithAuth";

export default function ProjectDetails(){
  const { id } = useParams();
  return (
    <div style={{ padding: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <Link to="/projects">← Back</Link>
      </div>
      <h2>Project {id}</h2>
      <MapboxMapComponentWithAuth projectId={id} />
    </div>
  );
}
