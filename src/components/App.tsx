import React, { useState, useReducer } from "react";
import { hot } from "react-hot-loader";
import { Place } from "../inaturalist";
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

const OFFLINE_MODE = false;

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  if (!state.location) {
    return (
      <LocationStep
        offlineMode={OFFLINE_MODE}
        onLocation={(location) => dispatch({ type: 'LOCATION_LOADED', location })}
      />
    );
  }

  if (!state.places) {
    return (
      <PlacesStep
        offlineMode={OFFLINE_MODE}
        location={state.location}
        onLoad={(places) => dispatch({ type: 'PLACES_LOADED', places })}
      />
    );
  }

  if (!state.selectedPlace) {
    return (
      <SelectPlaceStep
        places={state.places}
        onSelectPlace={(place) => dispatch({ type: 'PLACE_SELECTED', place })}
      />
    );
  }

  if (!state.selectedTaxaCategory) {
    return (
      <SelectTaxaCategoryStep
        onSelect={(taxaCategory) => dispatch({ type: 'TAXA_CATEGORY_SELECTED', taxaCategory })}
      />
    );
  }

  if (!state.speciesInRotation) {
    return (
      <LoadAllSpeciesStep
        offlineMode={OFFLINE_MODE}
        selectedPlace={state.selectedPlace}
        selectedTaxaCategory={state.selectedTaxaCategory}
        onLoad={(allSpecies) => dispatch({ type: 'ALL_SPECIES_LOADED', allSpecies })}
      />
    );
  }

  return (
    <Flashcard
      offlineMode={OFFLINE_MODE}
      revealed={state.flashcardRevealed}
      species={state.currentSpecies}
      onReveal={() => dispatch({ type: 'REVEAL_FLASHCARD' })}
      onNext={() => dispatch({ type: 'NEXT_FLASHCARD' })}
    />
  );
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
