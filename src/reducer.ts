import { State } from './state';
import { Action } from './Action';
import { Reducer } from 'react';
import { FlashcardData } from './flashcard-data';
import { FlashcardManager } from './flashcard-manager';

export const reducer: Reducer<State, Action> = (state: State, action: Action): State => {
  console.debug('Action dispatched', action);
  switch (action.type) {
    case 'LOCATION_LOADED': {
      return {
        ...state,
        location: action.location,
      };
    }
    case 'PLACES_LOADED': {
      return {
        ...state,
        places: action.places,
      };
    }
    case 'PLACE_SELECTED': {
      return {
        ...state,
        selectedPlace: action.place,
      };
    }
    case 'TAXA_CATEGORY_SELECTED': {
      return {
        ...state,
        selectedTaxaCategory: action.taxaCategory,
      };
    }
    case 'ALL_SPECIES_LOADED': {
      return {
        ...state,
        flashcards: new FlashcardManager(action.allSpecies),
      };
    }
    case 'REVEAL_FLASHCARD': {
      return {
        ...state,
        flashcardRevealed: true,
      };
    }
    case 'SCORE_FLASHCARD': {
      if (!state.flashcards) {
        throw new Error('foo');
      }
      state.flashcards.processScoredFlashcard(state.flashcards.current, action.flashcardRating);
      state.flashcards.loadNextFlashcard();
      return {
        ...state,
        flashcardRevealed: false,
        score: calculateScore(state.flashcards.inRotation),
      };
    }
    default: {
      // Redux has its own action that gets called upon initializing, and we need to handle
      // that here.
      return state;
    }
  }
};

const calculateScore = (flashcards: FlashcardData[]) => {
  return flashcards.reduce((sum, flashcard) => {
    return sum + 10 * Math.min(flashcard.streak, 3);
  }, 0);
};
