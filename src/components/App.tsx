import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader";
import { iNaturalistApi, Place, SpeciesCount } from "../inaturalist";
import { NesContainer } from "./NesContainer";
import { Location, LocationStep } from "./LocationStep";
import { PlacesStep } from "./PlacesStep";
import { SelectPlaceStep } from "./SelectPlaceStep";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

// TODO: is this list exhaustive?
const iconicTaxa = [
  'Animalia',
  'Amphibia',
  'Arachnida',
  'Aves',
  'Chromista',
  'Fungi',
  'Insecta',
  'Mammalia',
  'Mollusca',
  'Reptilia',
  'Plantae',
];

const App = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [places, setPlaces] = useState<Place[] | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>();
  const [selectedTaxaCategory, setSelectedTaxaCategory] = useState<string | undefined>();
  const [species, setSpecies] = useState<SpeciesCount[] | undefined>();
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
    const buttons = iconicTaxa.map((iconicTaxon, i) => {
      return (
        <div key={i}>
          <button className="nes-btn mb1" onClick={() => setSelectedTaxaCategory(iconicTaxon)}>{iconicTaxon}</button>
        </div>
      );
    });
    return (
      <NesContainer title={`Taxa Category`}>
        {buttons}
      </NesContainer>
    );
  }

  if (!species) {
    iNaturalistApi.fetchSpecies(selectedTaxaCategory, selectedPlace).then(species => {
      setSpecies(species);
    });

    return (
      <NesContainer title={`Flashcards`}>
        <p>Loading species...</p>
      </NesContainer>
    );
  }

  // TODO: make a step for this
  const numFlashcards = 50;

  if (!currentSpecies) {
    const randSpeciesIndex = Math.floor(Math.random() * Math.min(numFlashcards, species.length))
    setCurrentSpecies(species[randSpeciesIndex]);
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
