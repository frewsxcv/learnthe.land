import { GeoJsonObject } from 'geojson';
import { Location } from './location';

export const iNaturalistApi = {
  apiV1Fetch: async <T>(urlPath: string): Promise<T> => {
    const url = 'https://api.inaturalist.org' + urlPath;
    const response = await fetch(url);
    const json = await response.json();
    return json.results as T;
  },

  fetchPlaces: async (location: Location) => {
    return iNaturalistApi.apiV1Fetch<Nearby>(
      '/v1/places/nearby' +
        `?nelat=${location.latitude}` +
        `&nelng=${location.longitude}` +
        `&swlat=${location.latitude}` +
        `&swlng=${location.longitude}`
    );
  },

  // TODO: limit observations to above a certain count? so we get more common species
  // TODO: filter month?
  // TODO: parameterize iconic_taxa with an enum
  fetchAllSpeciesForPlace: async (iconicTaxa: IconicTaxa, place: Place) => {
    return iNaturalistApi.apiV1Fetch<SpeciesCount[]>(
      '/v1/observations/species_counts' +
        '?captive=false' +
        '&quality_grade=research' +
        `&place_id=${place.id}` +
        `&iconic_taxa=${iconicTaxa}`
    );
  },

  fetchObservationsForTaxon: async (taxonId: number) => {
    return iNaturalistApi.apiV1Fetch<Observation[]>(
      '/v1/observations' +
        '?photos=true' +
        // "&popular=true" +
        '&quality_grade=research' +
        `&taxon_id=${taxonId}` +
        '&identifications=most_agree' +
        '&per_page=10'
      // '&order_by=votes';
    );
  },

  fetchAncestorTaxa: async (taxon: Taxon) => {
    const taxonIds = taxon.ancestor_ids.join(',');

    return iNaturalistApi.apiV1Fetch<Taxon[]>(`/v1/taxa/${taxonIds}`);
  },
};

export interface Nearby {
  standard: Place[];
  community: unknown;
}

export interface Place {
  admin_level: number;
  ancestor_place_ids: null;
  bbox_area: number;
  bounding_box_geojson: { coordinates: unknown[] };
  display_name: string;
  geometry_geojson: GeoJsonObject;
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
  colors: unknown;
  conservation_status: unknown;
  conservation_statuses: unknown;
  default_photo: {
    id: number;
    attribution: string;
    license_code: string;
    url: string;
    medium_url: string;
    square_url: string;
  };
  establishment_means: unknown;
  observations_count: number;
  preferred_establishment_means: string;
  wikipedia_url?: string;
  ancestor_ids: number[];
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
  };
}

export const iconicTaxa = [
  'Actinopterygii',
  'Animalia',
  'Amphibia',
  'Arachnida',
  'Aves',
  'Chromista',
  'Fungi',
  'Insecta',
  'Mammalia',
  'Mollusca',
  'Reptilia',
  'Plantae',
  'Protozoa',
] as const;

export type IconicTaxa = typeof iconicTaxa[number];

export const iconicTaxaDescription: Record<IconicTaxa, string | null> = {
  Actinopterygii: 'Ray-Finned Fishes',
  Animalia: 'Animals',
  Amphibia: 'Amphibians',
  Arachnida: 'Arachnids',
  Aves: 'Birds',
  Chromista: null,
  Fungi: 'including Lichens',
  Insecta: 'Insects',
  Mammalia: 'Mammals',
  Mollusca: 'Mollusks',
  Reptilia: 'Reptiles',
  Plantae: 'Plants',
  Protozoa: null,
};
