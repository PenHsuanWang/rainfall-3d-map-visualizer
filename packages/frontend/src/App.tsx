import { useState } from "react";
import LeafletMap from "./components/LeafletMap";
import CsvUpload from "./components/CsvUpload";

export default function App() {
  const [refreshToken, setRefreshToken] = useState(0);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CsvUpload onUpload={() => setRefreshToken(Date.now())} />
      <LeafletMap refreshToken={refreshToken} />
    </div>
  );
}
