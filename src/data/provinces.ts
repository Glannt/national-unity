// Simplified Vietnam Province boundaries for visualization
// Each province has a center point and approximate boundary polygon
export interface ProvinceData {
  id: string;
  name: string;
  center: [number, number];
  bounds: [number, number][]; // Simplified polygon
}

// Major provinces/regions with ethnic populations
export const vietnamProvinces: ProvinceData[] = [
  {
    id: "son-la",
    name: "Sơn La",
    center: [21.3256, 103.9188],
    bounds: [
      [21.8, 103.2], [21.8, 104.6], [20.8, 104.6], [20.8, 103.2]
    ]
  },
  {
    id: "dien-bien",
    name: "Điện Biên",
    center: [21.3867, 103.0167],
    bounds: [
      [22.0, 102.4], [22.0, 103.5], [21.0, 103.5], [21.0, 102.4]
    ]
  },
  {
    id: "lai-chau",
    name: "Lai Châu",
    center: [22.3964, 103.4583],
    bounds: [
      [22.8, 102.8], [22.8, 103.8], [22.0, 103.8], [22.0, 102.8]
    ]
  },
  {
    id: "lao-cai",
    name: "Lào Cai",
    center: [22.4856, 103.9750],
    bounds: [
      [22.9, 103.5], [22.9, 104.5], [22.0, 104.5], [22.0, 103.5]
    ]
  },
  {
    id: "ha-giang",
    name: "Hà Giang",
    center: [22.8233, 104.9833],
    bounds: [
      [23.4, 104.4], [23.4, 105.6], [22.4, 105.6], [22.4, 104.4]
    ]
  },
  {
    id: "cao-bang",
    name: "Cao Bằng",
    center: [22.6667, 106.2500],
    bounds: [
      [23.1, 105.6], [23.1, 106.8], [22.2, 106.8], [22.2, 105.6]
    ]
  },
  {
    id: "lang-son",
    name: "Lạng Sơn",
    center: [21.8537, 106.7615],
    bounds: [
      [22.4, 106.2], [22.4, 107.2], [21.4, 107.2], [21.4, 106.2]
    ]
  },
  {
    id: "hoa-binh",
    name: "Hòa Bình",
    center: [20.8171, 105.3378],
    bounds: [
      [21.2, 104.8], [21.2, 105.8], [20.3, 105.8], [20.3, 104.8]
    ]
  },
  {
    id: "thanh-hoa",
    name: "Thanh Hóa",
    center: [19.8067, 105.7850],
    bounds: [
      [20.4, 104.8], [20.4, 106.2], [19.2, 106.2], [19.2, 104.8]
    ]
  },
  {
    id: "gia-lai",
    name: "Gia Lai",
    center: [13.9833, 108.0000],
    bounds: [
      [14.6, 107.4], [14.6, 108.6], [13.2, 108.6], [13.2, 107.4]
    ]
  },
  {
    id: "dak-lak",
    name: "Đắk Lắk",
    center: [12.6675, 108.0377],
    bounds: [
      [13.4, 107.4], [13.4, 108.8], [12.0, 108.8], [12.0, 107.4]
    ]
  },
  {
    id: "kon-tum",
    name: "Kon Tum",
    center: [14.3500, 108.0000],
    bounds: [
      [15.0, 107.4], [15.0, 108.4], [14.0, 108.4], [14.0, 107.4]
    ]
  },
  {
    id: "soc-trang",
    name: "Sóc Trăng",
    center: [9.6025, 105.9739],
    bounds: [
      [9.9, 105.5], [9.9, 106.3], [9.2, 106.3], [9.2, 105.5]
    ]
  },
  {
    id: "tra-vinh",
    name: "Trà Vinh",
    center: [9.9513, 106.3421],
    bounds: [
      [10.2, 106.0], [10.2, 106.7], [9.5, 106.7], [9.5, 106.0]
    ]
  },
  {
    id: "kien-giang",
    name: "Kiên Giang",
    center: [10.0125, 105.0809],
    bounds: [
      [10.5, 104.4], [10.5, 105.5], [9.3, 105.5], [9.3, 104.4]
    ]
  }
];

// Vietnam bounds for map restriction
export const VIETNAM_BOUNDS: [[number, number], [number, number]] = [
  [8.2, 102.1],   // Southwest corner
  [23.5, 109.5]   // Northeast corner
];

export const VIETNAM_CENTER: [number, number] = [16.0, 106.0];
