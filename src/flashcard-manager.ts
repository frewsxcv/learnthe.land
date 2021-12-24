import { FlashcardData } from './flashcard-data';
import { FlashcardRating } from './flashcard-rating';
import { SpeciesCount } from './inaturalist';

// TODO: make a step for this
const initialFlashcardCount = 5;

export class FlashcardManager {
  inRotation: FlashcardData[];
  notInRotation: FlashcardData[];
  current: FlashcardData;

  constructor(allSpecies: SpeciesCount[]) {
    // TODO: shuffle the initial flashcards in rotation
    const { inRotation, notInRotation } = fetchInitialFlashcards(allSpecies);
    this.inRotation = inRotation;
    this.notInRotation = notInRotation;
    this.current = popRandom(inRotation);
  }

  // TODO: explain the magic numbers in this function
  processScoredFlashcard(flashcard: FlashcardData, latestFlashcardRating: FlashcardRating) {
    if (latestFlashcardRating === 'dontknow') {
      flashcard.streak = 0;
    } else {
      console.assert(latestFlashcardRating === 'know');
      flashcard.streak += 1;
    }

    flashcard.attempts += 1;

    // TODO: introduce randomness

    // Insert the rated card somewhere else
    const lowestStreak = Math.min(...this.inRotation.map((flashcard) => flashcard.streak));
    const indexToInsert =
      this.inRotation.length -
      this.inRotation
        .slice()
        .reverse()
        .findIndex((flashcard) => flashcard.streak === lowestStreak) +
      2 ** flashcard.streak;
    this.inRotation.splice(indexToInsert, 0, flashcard);

    if (shouldAddNewFlashcard(this.inRotation)) {
      addNewFlashcard(this.inRotation, this.notInRotation);
    }

    console.debug('New flashcards state', this.inRotation);
  }

  loadNextFlashcard() {
    this.current = popFirst(this.inRotation);
  }
}

const addNewFlashcard = (
  flashcardsInRotation: FlashcardData[],
  flashcardsNotInRotation: FlashcardData[]
): void => {
  const minAttempts = Math.min(...flashcardsInRotation.map((flashcard) => flashcard.attempts));
  const indexToInsert =
    flashcardsInRotation.slice().findIndex((flashcard) => flashcard.attempts === minAttempts) + 1; // If we didn’t add one here, and if the user continues to press "Know", then they would only see new cards instead of cycling in old ones.
  const newFlashcard = flashcardsNotInRotation.splice(0, 1)[0]; // TODO: what to do about these indexings?
  console.assert(newFlashcard);

  flashcardsInRotation.splice(indexToInsert, 0, newFlashcard);
};

const shouldAddNewFlashcard = (flashcardsInRotation: FlashcardData[]): boolean => {
  return (
    allFlashcardsHaveBeenAttempted(flashcardsInRotation) &&
    doesntKnowFewerThanFiveFlashcards(flashcardsInRotation)
  );
};

const allFlashcardsHaveBeenAttempted = (flashcardsInRotation: FlashcardData[]): boolean => {
  return flashcardsInRotation.filter((flashcard) => flashcard.attempts === 0).length === 0;
};

const doesntKnowFewerThanFiveFlashcards = (flashcardsInRotation: FlashcardData[]): boolean => {
  const numFlashcardsUserDoesntKnow = flashcardsInRotation.filter(
    (flashcard) => flashcard.streak === 0
  ).length;
  return numFlashcardsUserDoesntKnow < 5;
};

const fetchInitialFlashcards = (
  allSpecies: SpeciesCount[]
): { inRotation: FlashcardData[]; notInRotation: FlashcardData[] } => {
  const inRotation = allSpecies.slice(0, initialFlashcardCount).map((species) => {
    return { species, streak: 0, attempts: 0, images: [] };
  });
  const notInRotation = allSpecies.slice(initialFlashcardCount).map((species) => {
    return { species, streak: 0, attempts: 0, images: [] };
  });
  return { inRotation, notInRotation };
};

const popFirst = <T>(items: T[]) => {
  return items.splice(0, 1)[0];
};

const popRandom = <T>(items: T[]) => {
  const randIndex = Math.floor(Math.random() * items.length);
  return items.splice(randIndex, 1)[0];
};
