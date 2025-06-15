// frontend/src/components/RainfallMap.tsx
import React, { useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { ColumnLayer, BitmapLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { RainfallDataPoint } from "@rain/common/src/types";
import { getRainfallData } from "../api/rainfallApi";

export default function RainfallMap() {
  const [data, setData] = useState<RainfallDataPoint[]>([]);
  useEffect(() => {
    getRainfallData().then(setData).catch(console.error);
  }, []);

  const rainfallLayer = new ColumnLayer<RainfallDataPoint>({
    id: "rainfall",
    data,
    pickable: true,
    radius: 5000,
    extruded: true,
    getPosition: (d) => [d.lon, d.lat],
    getElevation: (d) => d.value,
    elevationScale: 100,
    getFillColor: [30, 144, 255, 200],
  });

  const osmLayer = new TileLayer({
    id: "osm-base-map",
    data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    minZoom: 0,
    renderSubLayers: (props) => {
      const {
        west,
        south,
        east,
        north
      } = props.tile.bbox;           // <-- use bbox, not boundingBox
      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

  const initialViewState = {
    longitude: 120.9,
    latitude: 23.8,
    zoom: 6,
    pitch: 45,
  };

  return (
    <DeckGL
      initialViewState={initialViewState}
      controller
      layers={[osmLayer, rainfallLayer]}
      getTooltip={({ object }) =>
        object && `${object.value.toFixed(1)} mm rainfall`
      }
      style={{ position: "absolute", width: "100%", height: "100%" }}
    />
  );
}