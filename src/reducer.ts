import { State } from "./state";
import { Action } from "./Action";
import { Reducer } from "react";
import { SpeciesCount } from "./inaturalist";

// TODO: make a step for this
const numFlashcards = 50;

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
      return {
        ...state,
        speciesInRotation: action.allSpecies.slice(0, 50),
        speciesNotInRotation: action.allSpecies.slice(50),
        currentSpecies: selectRandomSpecies(action.allSpecies),
      };
    }
    case "REVEAL_FLASHCARD": {
      return {
        ...state,
        flashcardRevealed: true,
      };
    }
    case "NEXT_FLASHCARD": {
      return {
        ...state,
        currentSpecies: selectRandomSpecies(state.speciesInRotation),
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

const selectRandomSpecies = (allSpecies: SpeciesCount[]) => {
  const randSpeciesIndex = Math.floor(
    Math.random() * Math.min(numFlashcards, allSpecies.length)
  );

  return allSpecies[randSpeciesIndex];
};
