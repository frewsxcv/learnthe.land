import { State } from "./state";
import { Action } from "./Action";
import { Reducer } from 'react'
import { initialState } from './state';

export const reducer: Reducer<State, Action> = (state, action) => {
    console.debug('Action dispatched', action);
    switch (action.type) {
        case 'REVEAL_FLASHCARD': {
            return {
                ...state,
                flashcardRevealed: true,
            };
        }
        case 'NEXT_FLASHCARD': {
            return {
                ...state,
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
