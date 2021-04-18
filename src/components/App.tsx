import React, { useState, useReducer } from "react";
import { hot } from "react-hot-loader";
import { Place, SpeciesCount } from "../inaturalist";
import { Location, LocationStep } from "./LocationStep";
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

const App = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [places, setPlaces] = useState<Place[] | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>();
  const [selectedTaxaCategory, setSelectedTaxaCategory] = useState<
    string | undefined
  >();
  const [state, dispatch] = useReducer(reducer, initialState);

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

  if (!state.allSpecies) {
    return (
      <LoadAllSpeciesStep
        selectedPlace={selectedPlace}
        selectedTaxaCategory={selectedTaxaCategory}
        onLoad={(allSpecies) => dispatch({ type: 'ALL_SPECIES_LOADED', allSpecies })}
      />
    );
  }

  return (
    <Flashcard
      revealed={state.flashcardRevealed}
      species={state.currentSpecies}
      onReveal={() => dispatch({ type: 'REVEAL_FLASHCARD' })}
      onNext={() => dispatch({ type: 'NEXT_FLASHCARD' })}
    />
  );
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
