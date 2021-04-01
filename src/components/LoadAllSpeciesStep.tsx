import { iNaturalistApi } from "../inaturalist";
import { NesContainer } from "./NesContainer";
import { SpeciesCount, Place } from "../inaturalist";

export const LoadAllSpeciesStep = ({
  selectedTaxaCategory,
  selectedPlace,
  onLoad,
}: {
  selectedTaxaCategory: string;
  selectedPlace: Place;
  onLoad: (species: SpeciesCount[]) => void;
}) => {
  iNaturalistApi
    .fetchAllSpeciesForPlace(selectedTaxaCategory, selectedPlace)
    .then((species) => {
      onLoad(species);
    });

  return (
    <NesContainer title={`Flashcards`}>
      <p>Loading species...</p>
    </NesContainer>
  );
};
