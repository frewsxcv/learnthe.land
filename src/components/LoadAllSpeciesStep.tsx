import { iNaturalistApi } from "../inaturalist";
import { Frame } from "./Frame";
import { SpeciesCount, Place } from "../inaturalist";
import * as React from "react";

const reactLogo = require("./../assets/img/react_logo.svg");

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
  if (offlineMode) {
    window.setTimeout(() => onLoad([fakeSpecies]), 300);
    return loading;
  }

  iNaturalistApi
    .fetchAllSpeciesForPlace(selectedTaxaCategory, selectedPlace)
    .then((species) => {
      onLoad(species);
    });

  return loading;
};

const loading = (
  <Frame title={`Flashcards`}>
    <p>Loading species...</p>
  </Frame>
);

const fakeSpecies: SpeciesCount = {
  count: 10,
  taxon: {
    id: 1,
    iconic_taxon_id: 1,
    iconic_taxon_name: "Aves",
    is_active: true,
    name: "Rock Pigeon",
    preferred_common_name: "Pigeon",
    rank: "foo",
    rank_level: 1,
    colors: null,
    conservation_status: null,
    conservation_statuses: null,
    default_photo: {
      id: 1,
      attribution: "foo",
      license_code: "foo",
      url: reactLogo.default,
      medium_url: reactLogo.default,
      square_url: reactLogo.default,
    },
    establishment_means: null,
    observations_count: 10,
    preferred_establishment_means: "foo",
    wikipedia_url: "https://wikipedia.org/",
  },
};
