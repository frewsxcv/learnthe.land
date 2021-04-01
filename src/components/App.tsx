import React, { useState } from 'react';
import { hot } from "react-hot-loader";
import { Place, SpeciesCount } from "../inaturalist";
import { NesContainer } from "./NesContainer";
import { Location, LocationStep } from "./LocationStep";
import { PlacesStep } from "./PlacesStep";
import { SelectPlaceStep } from "./SelectPlaceStep";
import { SelectTaxaCategoryStep } from "./SelectTaxaCategoryStep";
import { LoadAllSpeciesStep } from "./LoadAllSpeciesStep";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

const App = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [places, setPlaces] = useState<Place[] | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>();
  const [selectedTaxaCategory, setSelectedTaxaCategory] = useState<string | undefined>();
  const [allSpecies, setAllSpecies] = useState<SpeciesCount[] | undefined>();
  const [currentSpecies, setCurrentSpecies] = useState<SpeciesCount | undefined>();
  const [revealSpecies, setRevealSpecies] = useState<boolean>(false);

  if (!location) {
    return (<LocationStep onLocation={(location) => setLocation(location)} />);
  }

  if (!places) {
    return (<PlacesStep location={location} onPlaces={(places) => setPlaces(places)} />);
  }

  if (!selectedPlace) {
    return (<SelectPlaceStep places={places} onSelectPlace={(place) => setSelectedPlace(place)} />);
  }

  if (!selectedTaxaCategory) {
    return (<SelectTaxaCategoryStep onSelect={(taxaCategory) => setSelectedTaxaCategory(taxaCategory)} />);
  }

  if (!allSpecies) {
    return (<LoadAllSpeciesStep selectedPlace={selectedPlace} selectedTaxaCategory={selectedTaxaCategory} onLoad={(allSpecies) => setAllSpecies(allSpecies)} />);
  }

  // TODO: make a step for this
  const numFlashcards = 50;

  if (!currentSpecies) {
    const randSpeciesIndex = Math.floor(Math.random() * Math.min(numFlashcards, allSpecies.length))
    setCurrentSpecies(allSpecies[randSpeciesIndex]);
    return;
  }

  if (!revealSpecies) {
    return (
      <NesContainer title={`Flashcards`}>
        <div>
          <img className="mb1" style={{ border: '4px solid black', maxWidth: '100%' }} src={currentSpecies.taxon.default_photo.medium_url} alt="" />
        </div>
        <button className="nes-btn" onClick={() => { setRevealSpecies(true) }}>Reveal</button>
      </NesContainer>
    );
  }

  return (
    <NesContainer title={`Flashcards`}>
      <div>
        <img className="mb1" style={{ border: '4px solid black', maxWidth: '100%' }} src={currentSpecies.taxon.default_photo.medium_url} alt="" />
      </div>
      <p>{currentSpecies.taxon.preferred_common_name}</p>
      <p>{currentSpecies.taxon.name}</p>
      <button className="nes-btn" onClick={() => { setRevealSpecies(false); setCurrentSpecies(undefined); }}>Next</button>
    </NesContainer>
  );
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
