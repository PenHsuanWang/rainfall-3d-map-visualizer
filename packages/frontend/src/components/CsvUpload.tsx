import React, { useRef, useState } from "react";
import { uploadCsv } from "../api/rainfallApi";

export default function CsvUpload({ onUpload }: { onUpload?: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadCsv(file);
      onUpload?.();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div style={{ margin: "10px 0" }}>
      <input type="file" accept=".csv" ref={inputRef} />
      <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: 8 }}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
