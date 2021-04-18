import { State } from "./state";
import { Action } from "./Action";
import { Reducer } from 'react';
import { SpeciesCount } from './inaturalist';

// TODO: make a step for this
const numFlashcards = 50;

export const reducer: Reducer<State, Action> = (state, action) => {
    console.debug('Action dispatched', action);
    switch (action.type) {
        case 'ALL_SPECIES_LOADED': {
            return {
                ...state,
                allSpecies: action.allSpecies,
                currentSpecies: selectRandomSpecies(action.allSpecies),
            };
        }
        case 'REVEAL_FLASHCARD': {
            return {
                ...state,
                flashcardRevealed: true,
            };
        }
        case 'NEXT_FLASHCARD': {
            return {
                ...state,
                currentSpecies: selectRandomSpecies(state.allSpecies),
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
