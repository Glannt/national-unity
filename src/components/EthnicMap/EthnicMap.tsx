import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";

import EthnicDetailPanel from "./EthnicDetailPanel";

import ethnicGroups from "@/data/ethnic_groups.json";
import {
  vietnamProvinces,
  vietnamIslands,
  VIETNAM_BOUNDS,
  VIETNAM_CENTER,
  SOVEREIGNTY_BANNER,
} from "@/data/provinces";
import { playEthnicSound } from "@/data/audio";
import { EthnicGroup } from "@/types";
import {
  fetchProvinceGeometry,
  PROVINCE_OSM_IDS,
  fetchProvinceByOsmId,
} from "@/utils/provinceGeometry";

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
  const realBoundaryLayerRef = useRef<L.GeoJSON | null>(null);
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
  const handleMarkerClick = useCallback(async (ethnic: EthnicGroup) => {
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

    // Hide placeholder province polygons
    if (provincesLayerRef.current) {
      provincesLayerRef.current.eachLayer((layer: any) => {
        if (layer.setStyle) {
          layer.setStyle({
            fillOpacity: 0,
            weight: 0,
          });
        }
      });
    }

    // Clear previous real boundary
    if (realBoundaryLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(realBoundaryLayerRef.current);
      realBoundaryLayerRef.current = null;
    }

    // Fetch and display real province boundary
    const provinceName = ethnic.provinces[0];

    if (provinceName && mapRef.current) {
      try {
        // Try OSM ID first for speed
        const osmId = PROVINCE_OSM_IDS[provinceName];
        let feature = null;

        if (osmId) {
          feature = await fetchProvinceByOsmId(osmId);
        }

        // Fallback to search if no OSM ID or fetch failed
        if (!feature) {
          feature = await fetchProvinceGeometry(provinceName);
        }

        if (feature && mapRef.current) {
          // Create GeoJSON layer with real boundary
          realBoundaryLayerRef.current = L.geoJSON(feature, {
            style: {
              color: "#f59e0b",
              weight: 3,
              fillColor: "#f59e0b",
              fillOpacity: 0.25,
              dashArray: "",
            },
          }).addTo(mapRef.current);

          // Optionally fit bounds to the province
          const bounds = realBoundaryLayerRef.current.getBounds();

          if (bounds.isValid()) {
            mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
          }
        }
      } catch (error) {
        console.error("Error loading province boundary:", error);
        // Fall back to highlighting placeholder
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
      }
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
    // Clear real boundary layer
    if (realBoundaryLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(realBoundaryLayerRef.current);
      realBoundaryLayerRef.current = null;
    }

    // Reset zoom level
    if (mapRef.current) {
      mapRef.current.setView(VIETNAM_CENTER, 6, { animate: true });
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

    // Create province polygons layer for hover interaction
    const provincesLayer = L.layerGroup().addTo(map);

    provincesLayerRef.current = provincesLayer;

    // Create a layer for showing real province boundaries
    let hoverBoundaryLayer: L.GeoJSON | null = null;
    let currentHoveredProvince: string | null = null;

    // Add invisible province hover zones (for detecting hover)
    vietnamProvinces.forEach((province) => {
      const polygon = L.polygon(province.bounds as L.LatLngExpression[], {
        color: "transparent",
        weight: 0,
        fillColor: "transparent",
        fillOpacity: 0,
        interactive: true,
        className: "province-hover-zone",
      });

      // Add feature properties
      (polygon as any).feature = {
        type: "Feature",
        properties: { id: province.id, name: province.name },
      };

      // Hover effects - load real boundary
      polygon.on("mouseover", async (e: L.LeafletMouseEvent) => {
        if (isExpanded) return;
        if (currentHoveredProvince === province.name) return;

        currentHoveredProvince = province.name;

        // Clear previous hover boundary
        if (hoverBoundaryLayer) {
          map.removeLayer(hoverBoundaryLayer);
          hoverBoundaryLayer = null;
        }

        // Show loading indicator via popup
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`<strong>${province.name}</strong>`)
          .openOn(map);

        try {
          // Fetch real province boundary
          const osmId = PROVINCE_OSM_IDS[province.name];
          let feature = null;

          if (osmId) {
            feature = await fetchProvinceByOsmId(osmId);
          }
          if (!feature) {
            feature = await fetchProvinceGeometry(province.name);
          }

          // Only show if still hovering same province
          if (currentHoveredProvince === province.name && feature) {
            hoverBoundaryLayer = L.geoJSON(feature, {
              style: {
                color: "#60a5fa",
                weight: 3,
                fillColor: "#3b82f6",
                fillOpacity: 0.25,
                dashArray: "",
              },
            }).addTo(map);
          }
        } catch {
          // Silent fail - just don't show boundary
        }
      });

      polygon.on("mouseout", () => {
        if (isExpanded) return;

        currentHoveredProvince = null;

        // Clear hover boundary
        if (hoverBoundaryLayer) {
          map.removeLayer(hoverBoundaryLayer);
          hoverBoundaryLayer = null;
        }
        map.closePopup();
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

    // === THÊM HOÀNG SA VÀ TRƯỜNG SA - LÃNH THỔ THIÊNG LIÊNG CỦA VIỆT NAM ===

    // Custom icon cho quần đảo (cờ Việt Nam)
    const islandIcon = L.divIcon({
      html: `<div style="
        background: linear-gradient(135deg, #da251d 0%, #c41e3a 100%);
        border: 3px solid #ffcd00;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(218, 37, 29, 0.5);
        animation: pulse 2s infinite;
      ">
        <span style="color: #ffcd00; font-size: 16px;">★</span>
      </div>`,
      className: "island-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Thêm markers cho Hoàng Sa và Trường Sa
    vietnamIslands.forEach((island) => {
      // Tạo marker cho quần đảo
      const marker = L.marker(island.center as L.LatLngExpression, {
        icon: islandIcon,
        riseOnHover: true,
      }).addTo(map);

      // Thêm label tiếng Việt (permanent tooltip)
      marker.bindTooltip(
        `<div style="
          background: linear-gradient(135deg, #da251d 0%, #c41e3a 100%);
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 13px;
          text-align: center;
          border: 2px solid #ffcd00;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        ">
          🇻🇳 ${island.nameVi} 🇻🇳
        </div>`,
        {
          permanent: true,
          direction: "top",
          offset: [0, -20],
          className: "island-label",
        },
      );

      // Popup khi click
      marker.bindPopup(
        `<div style="text-align: center; padding: 10px;">
          <h3 style="color: #da251d; font-weight: bold; margin-bottom: 8px; font-size: 16px;">
            🇻🇳 ${island.name}
          </h3>
          <p style="color: #333; font-size: 12px; line-height: 1.5;">
            ${island.description}
          </p>
          <div style="
            background: linear-gradient(135deg, #da251d, #c41e3a);
            color: white;
            padding: 8px;
            border-radius: 5px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 11px;
          ">
            CHỦ QUYỀN VIỆT NAM - BẤT KHẢ XÂM PHẠM
          </div>
        </div>`,
        {
          maxWidth: 300,
        },
      );
    });

    // === BIỂU NGỮ CHỦ QUYỀN TO TRÊN BẢN ĐỒ ===
    const SovereigntyControl = L.Control.extend({
      options: {
        position: "topright",
      },
      onAdd: function () {
        const container = L.DomUtil.create("div", "sovereignty-banner");

        container.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #da251d 0%, #b91c1c 50%, #da251d 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            border: 3px solid #ffcd00;
            box-shadow: 0 6px 25px rgba(218, 37, 29, 0.6), 0 0 20px rgba(255, 205, 0, 0.3);
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            animation: glow 2s ease-in-out infinite alternate;
            letter-spacing: 1px;
            cursor: pointer;
            transition: transform 0.3s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            ${SOVEREIGNTY_BANNER}
          </div>
        `;

        return container;
      },
    });

    new SovereigntyControl().addTo(map);

    // Thêm CSS animation cho pulse và glow
    const style = document.createElement("style");

    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 4px 15px rgba(218, 37, 29, 0.5); }
        50% { transform: scale(1.1); box-shadow: 0 6px 20px rgba(218, 37, 29, 0.8); }
        100% { transform: scale(1); box-shadow: 0 4px 15px rgba(218, 37, 29, 0.5); }
      }
      @keyframes glow {
        from { box-shadow: 0 6px 25px rgba(218, 37, 29, 0.6), 0 0 20px rgba(255, 205, 0, 0.3); }
        to { box-shadow: 0 6px 30px rgba(218, 37, 29, 0.8), 0 0 35px rgba(255, 205, 0, 0.5); }
      }
      .island-label .leaflet-tooltip-content {
        margin: 0 !important;
      }
      .island-label {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      .sovereignty-banner {
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);

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
    <div className="relative w-full min-h-[500px] lg:h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-3">
      {/* Map Container */}
      <motion.div
        animate={{
          width: isExpanded ? "35%" : "100%",
        }}
        className="relative z-10 rounded-xl shadow-lg overflow-hidden border-2 border-primary/20 h-[400px] lg:h-full"
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
            className="w-full lg:w-[65%] h-[500px] lg:h-full overflow-hidden"
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
