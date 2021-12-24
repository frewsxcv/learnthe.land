import { SpeciesCount } from './inaturalist';

export type FlashcardData = {
  species: SpeciesCount;
  streak: number;
  attempts: number;
  images: FlashcardImage[];
};

export type FlashcardImage = {
  src: string;
  attribution: string;
  // original height
  height: number;
  // original width
  width: number;
};
