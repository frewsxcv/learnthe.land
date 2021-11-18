import { FlashcardData } from "./flashcard-data";
import { IconicTaxa, Place, SpeciesCount } from "./inaturalist";
import { Location } from "./location";

export type State = {
  location?: Location;
  places?: Place[];
  selectedPlace?: Place;
  selectedTaxaCategory?: IconicTaxa;
  flashcards?: {
    inRotation: FlashcardData[];
    notInRotation: FlashcardData[];
    current: FlashcardData;
  };
  flashcardRevealed: boolean;
  score: number;
};

export const initialState: State = {
  location: undefined,
  places: undefined,
  selectedPlace: undefined,
  selectedTaxaCategory: undefined,
  flashcards: undefined,
  flashcardRevealed: false,
  score: 0,
};
