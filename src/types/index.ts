export interface EthnicGroup {
  id: string;
  name: string;
  population: number;
  provinces: string[];
  coordinates: [number, number];
  history: string;
  culture: {
    costume: string;
    cuisine: string;
    language: string;
    festivals: string;
  };
  society: {
    family: string;
    customs: string;
  };
  spirituality: {
    religion: string;
    worship: string;
    taboos: string;
  };
  hoChiMinhQuote: {
    quote: string;
    source: string;
    page: string;
  };
  image: string;
}

export interface TimelineEvent {
  id: number;
  year: string | number;
  title: string;
  description: string;
  quote: string;
  relatedRegions: string[];
  location?: string;
  image: string;
}

export interface ConnectionThread {
  id: string;
  title: string;
  description: string;
  quote: string;
  source: string;
  regions: {
    id: string;
    name: string;
    note: string;
  }[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  image: string;
}

export type IconSvgProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};
