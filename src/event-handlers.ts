import * as React from 'react';
import { Action } from './action';
import { IconicTaxa, iNaturalistApi, Place, SpeciesCount } from './inaturalist';
import { fakeSpecies } from './inaturalist-fake-data';

export const onSelectTaxaCategory = (
  place: Place,
  offlineMode: boolean,
  dispatch: React.Dispatch<Action>
) => {
  return (selectedTaxaCategory: IconicTaxa) => {
    loadAllSpecies({
      offlineMode,
      selectedPlace: place,
      selectedTaxaCategory: selectedTaxaCategory,
    }).then((species) => dispatch({ type: 'ALL_SPECIES_LOADED', allSpecies: species }));
    dispatch({ type: 'TAXA_CATEGORY_SELECTED', taxaCategory: selectedTaxaCategory });
  };
};

const loadAllSpecies = ({
  offlineMode,
  selectedTaxaCategory,
  selectedPlace,
}: {
  offlineMode: boolean;
  selectedTaxaCategory: IconicTaxa;
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
