import { SpeciesCount, Taxon } from './inaturalist';

export type FlashcardData = {
  species: SpeciesCount;
  streak: number;
  attempts: number;
  images: FlashcardImage[];
  ancestors: undefined | Taxon[];
};

export type FlashcardImage = {
  src: string;
  attribution: string;
  // original height
  height: number;
  // original width
  width: number;
};
