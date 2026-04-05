import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔥 ZOOM TO LOCATION
function FlyToLocation({ place }) {
  const map = useMap();

  useEffect(() => {
    if (place) {
      map.setView([place.lat, place.lng], 16, {
        animate: true,
      });
    }
  }, [place, map]);

  return null;
}

// 🔥 ICON THEO CATEGORY
const getIcon = (category) => {
  let emoji = "📍";

  if (category === "Ăn vặt") emoji = "🍟";
  if (category === "Bún/Phở") emoji = "🍜";
  if (category === "Cà phê") emoji = "☕";
  if (category === "Gà rán") emoji = "🍗";

  return L.divIcon({
    html: `<div style="font-size:24px">${emoji}</div>`,
    className: "", // bỏ class mặc định
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

export default function Map({ data, selectedPlace }) {
  return (
    <MapContainer
      center={[21.033, 105.85]}
      zoom={14}
      className="h-[300px] w-full rounded-2xl overflow-hidden"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FlyToLocation place={selectedPlace} />

      {data.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
          icon={getIcon(item.category)} // 🔥 FIX Ở ĐÂY
        >
          <Popup>{item.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}