import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader";
import { iNaturalistApi, Place } from "../inaturalist";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

const App = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [places, setPlaces] = useState<Place[] | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>();
  const [species, setSpecies] = useState<object[] | undefined>();

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
      <div className="nes-container with-title">
        <h1 className="title">Places</h1>
        <p>Requesting location...</p>
      </div>
    );
  }

  if (!places) {
    iNaturalistApi.fetchPlaces(location).then(places => {
      setPlaces(places);
    });
    return (
      <div className="nes-container with-title">
        <h1 className="title">Places</h1>
        <p>Loading...</p>
      </div>
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
      <div className="nes-container with-title">
        <h1 className="title">Places</h1>
        {placesElems}
      </div>
    );
  }

  if (!species) {
    iNaturalistApi.fetchSpecies(selectedPlace).then(species => {
      setSpecies(species);
    });

    return (
      <div className="nes-container with-title">
        <h1 className="title">Species ({selectedPlace.display_name})</h1>
        <p>Loading...</p>
      </div>
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
    <div className="nes-container with-title">
      <h1 className="title">Species ({selectedPlace.display_name})</h1>
      <ul className="nes-list is-disc">
        {speciesElems}
      </ul>
    </div>
  );
};

interface Location {
  longitude: number;
  latitude: number;
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
