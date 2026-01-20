import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import ethnicGroups from "@/data/ethnic_groups.json";
import { EthnicGroup } from "@/types";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map animations
function MapController({ selectedEthnic, isExpanded }: { selectedEthnic: EthnicGroup | null; isExpanded: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (selectedEthnic && isExpanded) {
      map.flyTo(selectedEthnic.coordinates as L.LatLngExpression, 8, {
        duration: 1.5,
      });
    } else {
      map.flyTo([16.0, 106.0], 6, {
        duration: 1,
      });
    }
  }, [selectedEthnic, isExpanded, map]);

  return null;
}

interface MapComponentProps {
  selectedEthnic: EthnicGroup | null;
  isExpanded: boolean;
  onMarkerClick: (ethnic: EthnicGroup) => void;
}

export default function MapComponent({ selectedEthnic, isExpanded, onMarkerClick }: MapComponentProps) {
  const vietnamCenter: L.LatLngExpression = [16.0, 106.0];

  return (
    <MapContainer
      center={vietnamCenter}
      zoom={6}
      className="w-full h-full rounded-xl shadow-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedEthnic={selectedEthnic} isExpanded={isExpanded} />

      {(ethnicGroups as EthnicGroup[]).map((ethnic) => (
        <Marker
          key={ethnic.id}
          position={ethnic.coordinates as L.LatLngExpression}
          icon={customIcon}
          eventHandlers={{
            click: () => onMarkerClick(ethnic),
          }}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{ethnic.name}</h3>
              <p className="text-sm text-gray-600">
                Dân số: {ethnic.population.toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-gray-500 mt-1">Click để xem chi tiết</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
