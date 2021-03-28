import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader";
import { iNaturalistApi, Place, SpeciesCount } from "../inaturalist";
import { NesContainer } from "./NesContainer";
import { LocationStep } from "./LocationStep";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

const App = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [places, setPlaces] = useState<Place[] | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>();
  const [species, setSpecies] = useState<SpeciesCount[] | undefined>();

  if (!location) {
    return (<LocationStep onLocation={setLocation} />);
  }

  if (!places) {
    iNaturalistApi.fetchPlaces(location).then(places => {
      setPlaces(places);
    });
    return (
      <NesContainer title="Places">
        <p>Loading...</p>
      </NesContainer>
    );
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

  const speciesElems = species.map((s, index) => {
    return (
      <li key={index}>
        {s.taxon.name}
        <br />
        <img src={s.taxon.default_photo.square_url} alt="" />
      </li>
    );
  });

  return (
    <NesContainer title={`Species (${selectedPlace.display_name})`}>
      <ul className="nes-list is-disc">
        {speciesElems}
      </ul>
    </NesContainer>
  );
};

interface Location {
  longitude: number;
  latitude: number;
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
