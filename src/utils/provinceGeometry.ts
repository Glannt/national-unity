// Utility to fetch real province boundaries from OpenStreetMap Nominatim API
// Cache to avoid repeated API calls
const provinceGeometryCache: Map<string, GeoJSON.Feature | null> = new Map();

// Rate limiting for Nominatim API (1 request per second recommended)
let lastRequestTime = 0;
const RATE_LIMIT_MS = 1100;

export interface NominatimResponse {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {
      name: string;
      display_name: string;
    };
    geometry: GeoJSON.Geometry;
  }>;
}

/**
 * Fetch province polygon from Nominatim API
 * @param provinceName - Name of the province in Vietnamese
 * @returns GeoJSON Feature with polygon geometry, or null if not found
 */
export async function fetchProvinceGeometry(
  provinceName: string
): Promise<GeoJSON.Feature | null> {
  // Check cache first
  const cacheKey = provinceName.toLowerCase();
  if (provinceGeometryCache.has(cacheKey)) {
    return provinceGeometryCache.get(cacheKey) || null;
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();

  try {
    // Search for the province in Vietnam
    const searchQuery = encodeURIComponent(`${provinceName}, Vietnam`);
    const url = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=geojson&polygon_geojson=1&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "National-Unity-Project/1.0",
        "Accept-Language": "vi,en",
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch geometry for ${provinceName}`);
      provinceGeometryCache.set(cacheKey, null);
      return null;
    }

    const data: NominatimResponse = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      provinceGeometryCache.set(cacheKey, feature);
      return feature;
    }

    provinceGeometryCache.set(cacheKey, null);
    return null;
  } catch (error) {
    console.error(`Error fetching province geometry for ${provinceName}:`, error);
    provinceGeometryCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Convert Nominatim geometry to Leaflet coordinates
 */
export function convertToLeafletCoords(
  geometry: GeoJSON.Geometry
): L.LatLngExpression[][] {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring) =>
      ring.map(([lng, lat]) => [lat, lng] as L.LatLngExpression)
    );
  } else if (geometry.type === "MultiPolygon") {
    // For MultiPolygon, flatten to single polygon (use first/largest)
    const allPolygons = geometry.coordinates.map((polygon) =>
      polygon.map((ring) =>
        ring.map(([lng, lat]) => [lat, lng] as L.LatLngExpression)
      )
    );
    // Return the first polygon's outer ring
    return allPolygons[0] || [];
  }
  return [];
}

/**
 * Clear the geometry cache (useful for testing)
 */
export function clearGeometryCache(): void {
  provinceGeometryCache.clear();
}

// Pre-defined OSM Relation IDs for faster lookup (optional optimization)
export const PROVINCE_OSM_IDS: Record<string, number> = {
  "Sơn La": 1903291,
  "Điện Biên": 1903118,
  "Lai Châu": 1903135,
  "Lào Cai": 1903085,
  "Hà Giang": 1903067,
  "Cao Bằng": 1903054,
  "Lạng Sơn": 1903039,
  "Hòa Bình": 1903335,
  "Thanh Hóa": 1903316,
  "Gia Lai": 1904048,
  "Đắk Lắk": 1904060,
  "Kon Tum": 1904035,
  "Sóc Trăng": 1904180,
  "Trà Vinh": 1904155,
  "Kiên Giang": 1904234,
};

/**
 * Fetch province by OSM Relation ID (faster than search)
 */
export async function fetchProvinceByOsmId(
  osmId: number
): Promise<GeoJSON.Feature | null> {
  const cacheKey = `osm_${osmId}`;
  if (provinceGeometryCache.has(cacheKey)) {
    return provinceGeometryCache.get(cacheKey) || null;
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();

  try {
    const url = `https://nominatim.openstreetmap.org/lookup?osm_ids=R${osmId}&format=geojson&polygon_geojson=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "National-Unity-Project/1.0",
      },
    });

    if (!response.ok) {
      provinceGeometryCache.set(cacheKey, null);
      return null;
    }

    const data: NominatimResponse = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      provinceGeometryCache.set(cacheKey, feature);
      return feature;
    }

    provinceGeometryCache.set(cacheKey, null);
    return null;
  } catch (error) {
    console.error(`Error fetching province by OSM ID ${osmId}:`, error);
    provinceGeometryCache.set(cacheKey, null);
    return null;
  }
}
