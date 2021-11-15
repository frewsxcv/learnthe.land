import { State } from "./state";
import { Action } from "./Action";
import { Reducer } from "react";
import { SpeciesCount } from "./inaturalist";
import { FlashcardRating } from "./flashcard-rating";
import { FlashcardData } from "./flashcard-data";

// TODO: make a step for this
const initialFlashcardCount = 10;

export const reducer: Reducer<State, Action> = (
  state: State,
  action: Action
): State => {
  console.debug("Action dispatched", action);
  switch (action.type) {
    case "LOCATION_LOADED": {
      return {
        ...state,
        location: action.location,
      };
    }
    case "PLACES_LOADED": {
      return {
        ...state,
        places: action.places,
      };
    }
    case "PLACE_SELECTED": {
      return {
        ...state,
        selectedPlace: action.place,
      };
    }
    case "TAXA_CATEGORY_SELECTED": {
      return {
        ...state,
        selectedTaxaCategory: action.taxaCategory,
      };
    }
    case "ALL_SPECIES_LOADED": {
      const flashcardsInRotation = action.allSpecies.slice(0, 10).map(species => { return { species, streak: 0 }; });
      // TODO: shuffle the initial flashcards in rotation
      return {
        ...state,
        flashcardsInRotation,
        flashcardsNotInRotation: action.allSpecies.slice(10).map(species => { return { species, streak: 0 }; }),
        currentFlashcard: popRandomSpecies(flashcardsInRotation),
      };
    }
    case "REVEAL_FLASHCARD": {
      return {
        ...state,
        flashcardRevealed: true,
      };
    }
    case "SCORE_FLASHCARD": {
      processScoredFlashcard(state.currentFlashcard, action.flashcardRating, state.flashcardsInRotation, state.flashcardsNotInRotation);
      return {
        ...state,
        currentFlashcard: popFirstSpecies(state.flashcardsInRotation),
        flashcardRevealed: false,
      };
    }
    default: {
      // Redux has its own action that gets called upon initializing, and we need to handle
      // that here.
      return state;
    }
  }
};

const popRandomSpecies = (allFlashcards: FlashcardData[]) => {
  const randSpeciesIndex = Math.floor(
    Math.random() * allFlashcards.length
  );

  return allFlashcards.splice(randSpeciesIndex, 1)[0];
};

const popFirstSpecies = (allFlashcards: FlashcardData[]) => {
  return allFlashcards.splice(0, 1)[0];
};

// TODO: explain the magic numbers in this function
const processScoredFlashcard = (
  flashcard: FlashcardData,
  latestFlashcardRating: FlashcardRating,
  flashcardsInRotation: FlashcardData[],
  flashcardsNotInRotation: FlashcardData[],
) => {
  if (latestFlashcardRating === "dontknow") {
    flashcard.streak = 0;
  } else {
    console.assert(latestFlashcardRating === "know");
    flashcard.streak += 1;
  }

  // TODO: add number of attempts to the flashcard data

  // TODO: introduce randomness
  flashcardsInRotation.splice(2 ** (1 + flashcard.streak), 0, flashcard);

  const numFlashcardsUserDoesntKnow = flashcardsInRotation.filter(flashcard => flashcard.streak === 0).length;

  if (numFlashcardsUserDoesntKnow < 5) {
    const newFlashcard = flashcardsNotInRotation.splice(0, 3)[0]; // TODO: what to do about these indexings?
    console.assert(newFlashcard);

    console.debug('Adding a new card', newFlashcard);

    flashcardsInRotation.splice(1, 0, newFlashcard);
  }

  console.debug('New flashcards state', flashcardsInRotation);
};
