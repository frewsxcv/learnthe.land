import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader";
import { iNaturalistApi, Place, SpeciesCount } from "../inaturalist";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

const App = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [places, setPlaces] = useState<Place[] | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>();
  const [species, setSpecies] = useState<SpeciesCount[] | undefined>();

  if (!location) {
    const result = navigator.geolocation.getCurrentPosition((result) => {
      setLocation({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      });
    }, () => {
      // TODO: error case
    });
    return (
      <NesContainer title="Places">
        <p>Request location...</p>
      </NesContainer>
    );
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

const NesContainer = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="nes-container with-title">
      <h1 className="title">{title}</h1>
      {children}
    </div>
  );
}

interface Location {
  longitude: number;
  latitude: number;
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
