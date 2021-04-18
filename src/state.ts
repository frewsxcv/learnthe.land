import { SpeciesCount } from "./inaturalist";

export type State = {
    speciesInRotation?: SpeciesCount[];
    speciesNotInRotation?: SpeciesCount[];
    currentSpecies?: SpeciesCount;
    flashcardRevealed: boolean;
};

export const initialState: State = {
    speciesInRotation: undefined,
    speciesNotInRotation: undefined,
    currentSpecies: undefined,
    flashcardRevealed: false,
};
