"use client";

import { Location } from "@prisma/client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import leaf from "leaflet"

interface MapProps {
    itineraries: Location[];
}

const markerIcon = leaf.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({itineraries}: MapProps){
    const center: [number, number] =
    itineraries.length > 0
      ? [itineraries[0].lat, itineraries[0].lng]
      : [-29.8587, 31.0218];

    return (
    <MapContainer
      center={center}
      zoom={8}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {itineraries.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={markerIcon}
        >
          <Popup>{location.locationTitle}</Popup>
        </Marker>
      ))}
    </MapContainer>
    );
};