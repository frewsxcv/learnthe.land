import { SpeciesCount } from "./inaturalist";

export type State = {
    allSpecies?: SpeciesCount[];
    currentSpecies?: SpeciesCount;
    flashcardRevealed: boolean;
};

export const initialState: State = {
    allSpecies: undefined,
    currentSpecies: undefined,
    flashcardRevealed: false,
};
