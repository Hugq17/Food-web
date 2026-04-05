import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FlyToLocation({ place }) {
  const map = useMap();

  useEffect(() => {
    if (place) {
      map.setView([place.lat, place.lng], 16, {
        animate: true,
      });
    }
  }, [place]);

  return null;
}

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
        <Marker key={item.id} position={[item.lat, item.lng]}>
          <Popup>{item.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}