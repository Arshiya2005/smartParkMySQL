// src/components/NearbyMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default marker icons setup (fixes missing icon issue)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Spot marker icon (default Leaflet style)
const spotIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

// Custom icon for user location
const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  shadowUrl: iconShadow,
});

const NearbyMap = ({ userLocation, spots }) => {
  const mapCenter = [userLocation.lat, userLocation.lon];

  return (
    <MapContainer
      center={mapCenter}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker for user's location */}
      <Marker position={mapCenter} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Markers for nearby parking spots */}
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lon]}
          icon={spotIcon}
        >
          <Popup>
            <strong>{spot.name}</strong>
            <br />
            {(spot.distance / 1000).toFixed(2)} km away
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default NearbyMap;