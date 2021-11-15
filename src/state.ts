import { FlashcardData } from "./flashcard-data";
import { IconicTaxa, Place, SpeciesCount } from "./inaturalist";
import { Location } from "./location";

export type State = {
  location?: Location;
  places?: Place[];
  selectedPlace?: Place;
  selectedTaxaCategory?: IconicTaxa;
  flashcardsInRotation?: FlashcardData[];
  flashcardsNotInRotation?: FlashcardData[];
  currentFlashcard?: FlashcardData;
  flashcardRevealed: boolean;
};

export const initialState: State = {
  location: undefined,
  places: undefined,
  selectedPlace: undefined,
  selectedTaxaCategory: undefined,
  flashcardsInRotation: undefined,
  flashcardsNotInRotation: undefined,
  currentFlashcard: undefined,
  flashcardRevealed: false,
};
