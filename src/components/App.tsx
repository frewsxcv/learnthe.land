import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader";
import { iNaturalistApi, Place, SpeciesCount } from "../inaturalist";
import { NesContainer } from "./NesContainer";
import { Location, LocationStep } from "./LocationStep";
import { PlacesStep } from "./PlacesStep";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

const App = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [places, setPlaces] = useState<Place[] | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>();
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
    const placesElems = places.map((place, i) => {
      const onClick = () => {
        setSelectedPlace(place);
      };
      return (
        <div key={i}>
          <button className="nes-btn" onClick={onClick}>{place.display_name}</button>
        </div>
      );
    });

    return (
      <NesContainer title="Places">
        {placesElems}
      </NesContainer>
    );
  }

  if (!species) {
    iNaturalistApi.fetchSpecies(selectedPlace).then(species => {
      setSpecies(species);
    });

    return (
      <NesContainer title={`Species (${selectedPlace.display_name})`}>
        <p>Loading...</p>
      </NesContainer>
    );
  }

  if (!currentSpecies) {
    setCurrentSpecies(species[Math.floor(Math.random() * species.length)]);
    return;
  }

  if (!revealSpecies) {
    return (
      <NesContainer title={`Flashcards`}>
        <div>
          <img src={currentSpecies.taxon.default_photo.medium_url} alt="" />
        </div>
        <button className="nes-btn" onClick={() => { setRevealSpecies(true) }}>Reveal</button>
      </NesContainer>
    );
  }

  return (
    <NesContainer title={`Flashcards`}>
      <div>
        <img src={currentSpecies.taxon.default_photo.medium_url} alt="" />
      </div>
      <p>{currentSpecies.taxon.preferred_common_name}</p>
      <p>{currentSpecies.taxon.name}</p>
      <button className="nes-btn" onClick={() => { setRevealSpecies(false); setCurrentSpecies(undefined); }}>Next</button>
    </NesContainer>
  );
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
