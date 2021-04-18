import { SpeciesCount } from './inaturalist';

export type Action =
    | { type: 'ALL_SPECIES_LOADED', allSpecies: SpeciesCount[] }
    | { type: 'REVEAL_FLASHCARD' }
    | { type: 'NEXT_FLASHCARD' };
