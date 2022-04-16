import { IconicTaxa, Place, SpeciesCount, Taxon } from './inaturalist';
import { Location } from './location';
import { FlashcardRating } from './flashcard-rating';
import { FlashcardImage } from './flashcard-data';

export type Action =
  | { type: 'LOCATION_LOADED'; location: Location }
  | { type: 'PLACES_LOADED'; places: Place[] }
  | { type: 'PLACE_SELECTED'; place: Place }
  | { type: 'TAXA_CATEGORY_SELECTED'; taxaCategory: IconicTaxa }
  | { type: 'ALL_SPECIES_LOADED'; allSpecies: SpeciesCount[] }
  | { type: 'REVEAL_FLASHCARD' }
  | { type: 'FLASHCARD_IMAGE_METADATA_LOADED'; images: FlashcardImage[] }
  | { type: 'FLASHCARD_ANCESTORS_LOADED'; ancestors: Taxon[] }
  | { type: 'SCORE_FLASHCARD'; flashcardRating: FlashcardRating };
