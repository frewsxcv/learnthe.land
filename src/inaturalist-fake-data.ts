import { Feature, Point } from 'geojson';
import { Place, SpeciesCount } from './inaturalist';

const reactLogo = require('./../assets/img/react_logo.svg');

export const fakeSpecies: SpeciesCount = {
  count: 10,
  taxon: {
    id: 1,
    iconic_taxon_id: 1,
    iconic_taxon_name: 'Aves',
    is_active: true,
    name: 'Rock Pigeon',
    preferred_common_name: 'Pigeon',
    rank: 'foo',
    rank_level: 1,
    colors: null,
    conservation_status: null,
    conservation_statuses: null,
    default_photo: {
      id: 1,
      attribution: 'foo',
      license_code: 'foo',
      url: reactLogo.default,
      medium_url: reactLogo.default,
      square_url: reactLogo.default,
    },
    establishment_means: null,
    observations_count: 10,
    preferred_establishment_means: 'foo',
    wikipedia_url: 'https://wikipedia.org/',
    ancestor_ids: [],
  },
};

export const fakeGeoJsonGeometry: Point = {
  type: 'Point',
  coordinates: [125.6, 10.1],
};

export const fakeGeoJsonFeature: Feature = {
  type: 'Feature',
  geometry: fakeGeoJsonGeometry,
  properties: {},
};

export const fakePlace: Place = {
  admin_level: 1,
  ancestor_place_ids: null,
  bbox_area: 1,
  bounding_box_geojson: { coordinates: [] },
  display_name: 'Faketown',
  geometry_geojson: fakeGeoJsonFeature,
  id: 1,
  location: 'faketown',
  name: 'faketown',
  place_type: 1,
  slug: 'faketown',
  uuid: '16fd2706-8baf-433b-82eb-8c7fada847da',
};
