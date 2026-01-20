import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";

import EthnicDetailPanel from "./EthnicDetailPanel";

import ethnicGroups from "@/data/ethnic_groups.json";
import {
  vietnamProvinces,
  VIETNAM_BOUNDS,
  VIETNAM_CENTER,
} from "@/data/provinces";
import { playEthnicSound } from "@/data/audio";
import { EthnicGroup } from "@/types";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const activeIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function EthnicMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const provincesLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedEthnic, setSelectedEthnic] = useState<EthnicGroup | null>(
    null,
  );
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Reset panel state when component mounts (fix navigation bug)
  useEffect(() => {
    setSelectedEthnic(null);
    setSelectedProvince(null);
    setIsExpanded(false);
  }, []);

  // Get ethnic groups for selected province
  const getEthnicsForProvince = useCallback(
    (province: string): EthnicGroup[] => {
      return (ethnicGroups as EthnicGroup[]).filter((ethnic) =>
        ethnic.provinces.some(
          (p) =>
            p.toLowerCase().includes(province.toLowerCase()) ||
            province.toLowerCase().includes(p.toLowerCase()),
        ),
      );
    },
    [],
  );

  // Handle marker click
  const handleMarkerClick = useCallback((ethnic: EthnicGroup) => {
    // Play ethnic sound
    playEthnicSound(ethnic.id);

    // Update all markers
    markersRef.current.forEach((marker, id) => {
      if (id === ethnic.id) {
        marker.setIcon(activeIcon);
      } else {
        marker.setIcon(defaultIcon);
      }
    });

    // Highlight province polygon
    if (provincesLayerRef.current) {
      provincesLayerRef.current.eachLayer((layer: any) => {
        if (layer.feature) {
          const isSelected = ethnic.provinces.some((p) =>
            p
              .toLowerCase()
              .includes(layer.feature.properties.name.toLowerCase()),
          );

          layer.setStyle({
            fillColor: isSelected ? "#f59e0b" : "#3b82f6",
            fillOpacity: isSelected ? 0.5 : 0.1,
            weight: isSelected ? 3 : 1,
            color: isSelected ? "#f59e0b" : "#3b82f6",
          });
        }
      });
    }

    setSelectedEthnic(ethnic);
    setSelectedProvince(ethnic.provinces[0]);
    setIsExpanded(true);
  }, []);

  // Handle close panel
  const handleClosePanel = useCallback(() => {
    // Reset markers
    markersRef.current.forEach((marker) => {
      marker.setIcon(defaultIcon);
    });

    // Reset province styles
    if (provincesLayerRef.current) {
      provincesLayerRef.current.eachLayer((layer: any) => {
        if (layer.setStyle) {
          layer.setStyle({
            fillColor: "#3b82f6",
            fillOpacity: 0.1,
            weight: 1,
            color: "#3b82f6",
          });
        }
      });
    }

    setIsExpanded(false);

    setTimeout(() => {
      setSelectedEthnic(null);
      setSelectedProvince(null);
    }, 500);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map with bounds
    const map = L.map(mapContainerRef.current, {
      center: VIETNAM_CENTER,
      zoom: 6,
      minZoom: 5,
      maxZoom: 10,
      maxBounds: L.latLngBounds(VIETNAM_BOUNDS[0], VIETNAM_BOUNDS[1]),
      maxBoundsViscosity: 1.0,
      scrollWheelZoom: true,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Create province polygons layer
    const provincesLayer = L.layerGroup().addTo(map);

    provincesLayerRef.current = provincesLayer;

    // Add province polygons with hover effect
    vietnamProvinces.forEach((province) => {
      const polygon = L.polygon(province.bounds as L.LatLngExpression[], {
        color: "#60a5fa",
        weight: 2,
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
        dashArray: "5, 5",
        className: "province-polygon",
      });

      // Add feature properties
      (polygon as any).feature = {
        type: "Feature",
        properties: { id: province.id, name: province.name },
      };

      // Hover effects
      polygon.on("mouseover", (e: L.LeafletMouseEvent) => {
        if (!isExpanded) {
          polygon.setStyle({
            fillOpacity: 0.3,
            weight: 2,
            color: "#60a5fa",
          });

          // Show tooltip
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`<strong>${province.name}</strong>`)
            .openOn(map);
        }
      });

      polygon.on("mouseout", () => {
        if (!isExpanded) {
          polygon.setStyle({
            fillOpacity: 0.1,
            weight: 1,
            color: "#3b82f6",
          });
          map.closePopup();
        }
      });

      // Click to find ethnics in this province
      polygon.on("click", () => {
        const ethnicsInProvince = getEthnicsForProvince(province.name);

        if (ethnicsInProvince.length > 0) {
          handleMarkerClick(ethnicsInProvince[0]);
        }
      });

      polygon.addTo(provincesLayer);
    });

    // Add markers for each ethnic group
    (ethnicGroups as EthnicGroup[]).forEach((ethnic) => {
      const marker = L.marker(ethnic.coordinates as L.LatLngExpression, {
        icon: defaultIcon,
        riseOnHover: true,
      }).addTo(map);

      // Store marker reference
      markersRef.current.set(ethnic.id, marker);

      // Determine if marker is in the upper half of Vietnam (north of 18 degrees)
      const isNorth = ethnic.coordinates[0] > 18;

      // Use tooltip instead of popup for better positioning control
      // Direction: auto will show above if there's space, below otherwise
      const tooltipContent = `
        <div class="text-center p-2" style="min-width: 150px;">
          <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${ethnic.name}</h3>
          <p style="font-size: 12px; color: #666;">Dân số: ${ethnic.population.toLocaleString("vi-VN")}</p>
          <p style="font-size: 10px; color: #999; margin-top: 4px;">🔊 Click để nghe âm thanh</p>
        </div>
      `;

      // Bind tooltip with position based on marker location
      marker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: isNorth ? "bottom" : "top",
        offset: isNorth ? [0, 10] : [0, -10],
        className: "ethnic-tooltip",
        opacity: 1,
      });

      // Also bind popup for click (with autoPan disabled)
      marker.bindPopup(tooltipContent, {
        autoPan: false,
        closeOnClick: true,
        offset: isNorth ? [0, 10] : [0, -40],
      });

      // Hover effect - show tooltip
      marker.on("mouseover", () => {
        marker.openTooltip();
      });

      marker.on("mouseout", () => {
        marker.closeTooltip();
      });

      marker.on("click", () => {
        handleMarkerClick(ethnic);
      });
    });

    mapRef.current = map;
    setMapReady(true);

    // Force invalidateSize after a short delay to ensure tiles load properly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Additional invalidateSize after tiles might have loaded
    setTimeout(() => {
      map.invalidateSize();
    }, 500);

    // Use ResizeObserver to handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Handle window resize
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [getEthnicsForProvince, handleMarkerClick]);

  // Handle map resize and animation when panel opens/closes
  useEffect(() => {
    if (!mapRef.current) return;

    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();

      if (selectedEthnic && isExpanded) {
        mapRef.current?.flyTo(
          selectedEthnic.coordinates as L.LatLngExpression,
          8,
          {
            duration: 1,
          },
        );
      } else {
        mapRef.current?.flyTo(VIETNAM_CENTER, 6, {
          duration: 0.8,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isExpanded, selectedEthnic]);

  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px] flex gap-4">
      {/* Map Container */}
      <motion.div
        animate={{
          width: isExpanded ? "45%" : "100%",
          scale: isExpanded ? 0.98 : 1,
        }}
        className="relative z-10 rounded-xl shadow-lg overflow-hidden border-2 border-primary/20"
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{ minHeight: "500px" }}
        />

        {/* Loading indicator */}
        {!mapReady && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-default-500">Đang tải bản đồ...</p>
            </div>
          </div>
        )}

        {/* Sound indicator */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
          <span className="text-lg">🔊</span>
          <span className="text-xs text-default-500">
            Click marker để nghe nhạc cụ
          </span>
        </div>
      </motion.div>

      {/* Ethnic Detail Panel */}
      <AnimatePresence mode="wait">
        {isExpanded && selectedProvince && (
          <motion.div
            key="ethnic-panel"
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            className="w-[55%] h-full overflow-hidden"
            exit={{
              opacity: 0,
              scale: 0.8,
              x: 100,
            }}
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <EthnicDetailPanel
              ethnics={getEthnicsForProvince(selectedProvince)}
              selectedEthnic={selectedEthnic}
              onClose={handleClosePanel}
              onSelectEthnic={(ethnic) => {
                playEthnicSound(ethnic.id);
                setSelectedEthnic(ethnic);

                // Update marker icons
                markersRef.current.forEach((marker, id) => {
                  marker.setIcon(id === ethnic.id ? activeIcon : defaultIcon);
                });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
