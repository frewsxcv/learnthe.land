import React, { useReducer } from "react";
import { hot } from "react-hot-loader";
import { LocationStep } from "./LocationStep";
import { PlacesStep } from "./PlacesStep";
import { SelectPlaceStep } from "./SelectPlaceStep";
import { SelectTaxaCategoryStep } from "./SelectTaxaCategoryStep";
import { LoadAllSpeciesStep } from "./LoadAllSpeciesStep";
import { Flashcard } from "./Flashcard";
import { initialState } from "../state";
import { reducer } from "../reducer";

// const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Frame } from "./Frame";

const OFFLINE_MODE = false;

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  let inner: JSX.Element;

  if (!state.location) {
    inner = (
      <LocationStep
        offlineMode={OFFLINE_MODE}
        onLocation={(location) =>
          dispatch({ type: "LOCATION_LOADED", location })
        }
      />
    );
  } else if (!state.places) {
    inner = (
      <PlacesStep
        offlineMode={OFFLINE_MODE}
        location={state.location}
        onLoad={(places) => dispatch({ type: "PLACES_LOADED", places })}
      />
    );
  } else if (!state.selectedPlace) {
    inner = (
      <SelectPlaceStep
        places={state.places}
        onSelectPlace={(place) => dispatch({ type: "PLACE_SELECTED", place })}
      />
    );
  } else if (!state.selectedTaxaCategory) {
    inner = (
      <SelectTaxaCategoryStep
        onSelect={(taxaCategory) =>
          dispatch({ type: "TAXA_CATEGORY_SELECTED", taxaCategory })
        }
      />
    );
  } else if (!state.flashcardsInRotation) {
    inner = (
      <LoadAllSpeciesStep
        offlineMode={OFFLINE_MODE}
        selectedPlace={state.selectedPlace}
        selectedTaxaCategory={state.selectedTaxaCategory}
        onLoad={(allSpecies) =>
          dispatch({ type: "ALL_SPECIES_LOADED", allSpecies })
        }
      />
    );
  } else {
    inner = (
      <Flashcard
        offlineMode={OFFLINE_MODE}
        revealed={state.flashcardRevealed}
        data={state.currentFlashcard}
        onReveal={() => dispatch({ type: "REVEAL_FLASHCARD" })}
        onRateClick={(rating) => dispatch({ type: "SCORE_FLASHCARD", flashcardRating: rating })}
      />
    );
  }

  return (
    <Frame selectedPlace={state.selectedPlace} selectedTaxaCategory={state.selectedTaxaCategory} score={state.score}>
      {inner}
    </Frame>
  )
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
