export const iNaturalistApi = {
  fetchPlaces: (location) => {
    const url =
      "https://api.inaturalist.org" +
      "/v1/places/nearby" +
      `?nelat=${location.latitude}` +
      `&nelng=${location.longitude}` +
      `&swlat=${location.latitude}` +
      `&swlng=${location.longitude}`;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        // TODO: do we care about `json.community`?
        return json.results.standard as Place[];
      });
  },

  // TODO: limit observations to above a certain count? so we get more common species
  // TODO: filter month?
  // TODO: parameterize iconic_taxa with an enum
  fetchAllSpeciesForPlace: (iconicTaxa: string, place: Place) => {
    const url =
      "https://api.inaturalist.org" +
      "/v1/observations/species_counts" +
      "?captive=false" +
      "&quality_grade=research" +
      `&place_id=${place.id}` +
      `&iconic_taxa=${iconicTaxa}`;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        return json.results as SpeciesCount[];
      });
  },

  fetchObservationsForTaxon: (taxonId: number) => {
    const url =
      "https://api.inaturalist.org" +
      "/v1/observations" +
      "?photos=true" +
      "&popular=true" +
      "&quality_grade=research" +
      `&taxon_id=${taxonId}` +
      "&identifications=most_agree" +
      "&per_page=10";
    // '&order_by=votes';

    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        return json.results as Observation[];
      });
  },
};

export interface Place {
  admin_level: number;
  ancestor_place_ids: null;
  bbox_area: number;
  bounding_box_geojson: { coordinates: any[] };
  display_name: string;
  geometry_geojson: object;
  id: number;
  location: string;
  name: string;
  place_type: number;
  slug: string;
  uuid: string;
}

export interface SpeciesCount {
  count: number;
  taxon: Taxon;
}

export interface Taxon {
  id: number;
  iconic_taxon_id: number;
  iconic_taxon_name: IconicTaxa;
  is_active: boolean;
  name: string;
  preferred_common_name?: string;
  rank: string;
  rank_level: number;
  colors: any;
  conservation_status: any;
  conservation_statuses: any;
  default_photo: {
    id: number;
    attribution: string;
    license_code: string;
    url: string;
    medium_url: string;
    square_url: string;
  };
  establishment_means: any;
  observations_count: number;
  preferred_establishment_means: string;
  wikipedia_url?: string;
}

export interface Observation {
  photos: Photo[];
}

export interface Photo {
  id: number;
  license_code: string;
  url: string;
  attribution: string;
  original_dimensions: {
    width: number;
    height: number;
  }
}

export const iconicTaxa = [
  "Animalia",
  "Amphibia",
  "Arachnida",
  "Aves",
  "Chromista",
  "Fungi",
  "Insecta",
  "Mammalia",
  "Mollusca",
  "Reptilia",
  "Plantae",
] as const;

export type IconicTaxa = typeof iconicTaxa[number];
