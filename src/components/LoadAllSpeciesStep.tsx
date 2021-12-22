import { iNaturalistApi } from '../inaturalist';
import { SpeciesCount, Place } from '../inaturalist';
import * as React from 'react';

const reactLogo = require('./../assets/img/react_logo.svg');

export const LoadAllSpeciesStep = ({
  offlineMode,
  selectedTaxaCategory,
  selectedPlace,
  onLoad,
}: {
  offlineMode: boolean;
  selectedTaxaCategory: string;
  selectedPlace: Place;
  onLoad: (species: SpeciesCount[]) => void;
}) => {
  loadAllSpecies({ offlineMode, selectedTaxaCategory, selectedPlace }).then((species) =>
    onLoad(species)
  );
  return loading;
};

const loadAllSpecies = ({
  offlineMode,
  selectedTaxaCategory,
  selectedPlace,
}: {
  offlineMode: boolean;
  selectedTaxaCategory: string;
  selectedPlace: Place;
}): Promise<SpeciesCount[]> => {
  if (offlineMode) {
    return new Promise((resolve) => {
      window.setTimeout(() => resolve([fakeSpecies]), 300);
    });
  } else {
    return iNaturalistApi.fetchAllSpeciesForPlace(selectedTaxaCategory, selectedPlace);
  }
};

const loading = <p>Loading species...</p>;

const fakeSpecies: SpeciesCount = {
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
  },
};
