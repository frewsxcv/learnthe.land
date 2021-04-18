import React, { useState, useReducer } from "react";
import { hot } from "react-hot-loader";
import { Place, SpeciesCount } from "../inaturalist";
import { Location, LocationStep } from "./LocationStep";
import { PlacesStep } from "./PlacesStep";
import { SelectPlaceStep } from "./SelectPlaceStep";
import { SelectTaxaCategoryStep } from "./SelectTaxaCategoryStep";
import { LoadAllSpeciesStep } from "./LoadAllSpeciesStep";
import { Flashcard } from "./Flashcard";
import { DEFAULT_STATE, State } from "../state";
import { reducer } from "../reducer";

// const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [places, setPlaces] = useState<Place[] | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>();
  const [selectedTaxaCategory, setSelectedTaxaCategory] = useState<
    string | undefined
  >();
  const [allSpecies, setAllSpecies] = useState<SpeciesCount[] | undefined>();
  const [currentSpecies, setCurrentSpecies] = useState<
    SpeciesCount | undefined
  >();
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  if (!location) {
    return <LocationStep onLocation={(location) => setLocation(location)} />;
  }

  if (!places) {
    return (
      <PlacesStep
        location={location}
        onPlaces={(places) => setPlaces(places)}
      />
    );
  }

  if (!selectedPlace) {
    return (
      <SelectPlaceStep
        places={places}
        onSelectPlace={(place) => setSelectedPlace(place)}
      />
    );
  }

  if (!selectedTaxaCategory) {
    return (
      <SelectTaxaCategoryStep
        onSelect={(taxaCategory) => setSelectedTaxaCategory(taxaCategory)}
      />
    );
  }

  if (!allSpecies) {
    return (
      <LoadAllSpeciesStep
        selectedPlace={selectedPlace}
        selectedTaxaCategory={selectedTaxaCategory}
        onLoad={(allSpecies) => setAllSpecies(allSpecies)}
      />
    );
  }

  // TODO: make a step for this
  const numFlashcards = 50;

  if (!currentSpecies) {
    const randSpeciesIndex = Math.floor(
      Math.random() * Math.min(numFlashcards, allSpecies.length)
    );
    setCurrentSpecies(allSpecies[randSpeciesIndex]);
    return;
  }

  return (
    <Flashcard
      revealed={state.flashcardRevealed}
      species={currentSpecies}
      onReveal={() => {
        dispatch({ type: 'REVEAL_FLASHCARD' })
      }}
      onNext={() => {
        dispatch({ type: 'NEXT_FLASHCARD' })
        setCurrentSpecies(undefined);
      }}
    ></Flashcard>
  );
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
