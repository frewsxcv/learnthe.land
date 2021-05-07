import { IconicTaxa, Place, SpeciesCount } from "./inaturalist";
import { Location } from "./location";

export type State = {
    location?: Location;
    places?: Place[];
    selectedPlace?: Place;
    selectedTaxaCategory?: IconicTaxa;
    speciesInRotation?: SpeciesCount[];
    speciesNotInRotation?: SpeciesCount[];
    currentSpecies?: SpeciesCount;
    flashcardRevealed: boolean;
};

export const initialState: State = {
    location: undefined,
    places: undefined,
    selectedPlace: undefined,
    selectedTaxaCategory: undefined,
    speciesInRotation: undefined,
    speciesNotInRotation: undefined,
    currentSpecies: undefined,
    flashcardRevealed: false,
};
