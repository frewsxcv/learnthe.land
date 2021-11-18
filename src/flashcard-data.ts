import { SpeciesCount } from './inaturalist';

export type FlashcardData = {
  species: SpeciesCount;
  streak: number;
  attempts: number;
};
