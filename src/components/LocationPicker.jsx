import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#4CC9C0;border:3px solid #0B2027;box-shadow:0 0 0 2px #4CC9C0;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function ClickHandler({ onPick }) {
  useMapEvents({ click(e) { onPick([e.latlng.lat, e.latlng.lng]); } });
  return null;
}

export default function LocationPicker({ position, onChange }) {
  const [center] = useState(position || [17.385, 78.4867]);

  return (
    <div>
      <div className="rounded-lg overflow-hidden border border-riverLight/50" style={{ height: 260 }}>
        <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onPick={onChange} />
          {position && <Marker position={position} icon={pinIcon} />}
        </MapContainer>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="font-mono text-xs text-mistDim">
          {position ? `${position[0].toFixed(4)}, ${position[1].toFixed(4)}` : "Click the map to drop a pin"}
        </p>
        <button type="button" className="font-mono text-xs text-cyan hover:underline"
          onClick={() => navigator.geolocation?.getCurrentPosition((pos) => onChange([pos.coords.latitude, pos.coords.longitude]))}>
          Use my current location
        </button>
      </div>
    </div>
  );
}
