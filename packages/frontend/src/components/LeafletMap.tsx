import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { RainfallDataPoint } from "@rain/common/src/types";
import { getRainfallData } from "../api/rainfallApi";

// Utility functions to style markers
function getRainfallColor(value: number): string {
  if (value < 50) return "#87CEEB";
  if (value < 100) return "#1E90FF";
  if (value < 150) return "#0066CC";
  return "#003399";
}

function getRainfallRadius(value: number): number {
  return Math.max(8, Math.min(25, value / 8));
}

export default function LeafletMap() {
  const [data, setData] = useState<RainfallDataPoint[]>([]);

  useEffect(() => {
    getRainfallData().then(setData).catch(console.error);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer center={[23.8, 120.9]} zoom={7} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
          maxZoom={18}
        />
        {data.map((station, idx) => (
          <CircleMarker
            key={idx}
            center={[station.lat, station.lon]}
            radius={getRainfallRadius(station.value)}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: getRainfallColor(station.value),
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <div className="rainfall-popup">
                <h4 style={{ margin: "5px 0", color: getRainfallColor(station.value) }}>
                  {station.timestamp ? new Date(station.timestamp).toLocaleString() : "Rainfall"}
                </h4>
                <p style={{ margin: "5px 0" }}>
                  <strong>Rainfall:</strong> {station.value}mm
                </p>
                <p style={{ margin: "5px 0", fontSize: "11px", color: "#666" }}>
                  Coordinates: {station.lat.toFixed(4)}°N, {station.lon.toFixed(4)}°E
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        <ScaleControl position="bottomleft" />
      </MapContainer>
      <div className="controls">
        <h4 style={{ margin: "0 0 5px 0" }}>Taiwan Rainfall Map</h4>
        <p style={{ margin: 0, color: "#666" }}>Click circles for details</p>
      </div>
      <div className="legend">
        <h3>Rainfall Levels</h3>
        <div className="legend-item">
          <div className="legend-color" style={{ background: "#87CEEB" }}></div>
          <span>Light (0-50mm)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: "#1E90FF" }}></div>
          <span>Moderate (50-100mm)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: "#0066CC" }}></div>
          <span>Heavy (100-150mm)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: "#003399" }}></div>
          <span>Very Heavy (150mm+)</span>
        </div>
      </div>
    </div>
  );
}
