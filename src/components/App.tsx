import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

const App = () => {
  const [places, setPlaces] = useState<Place[] | undefined>(undefined);

  if (!places) {
    iNaturalistApi.fetchPlaces().then(places => {
      console.log('setting places', places);
      setPlaces(places);
    });
    return (
      <p>Loading places...</p>
    );
  }

  const placesElems = places.map((place, i) => {
    return (
      <div>
        <button className="nes-btn" key={i}>{place.display_name}</button>
      </div>
    );
  });

  return (
    <>
      <h1>Places</h1>
      {placesElems}
    </>
  );
};

interface AppState {
  places?: string[];
};

const iNaturalistApi = {
  // 'https://api.inaturalist.org/v1/observations/species_counts?captive=false&quality_grade=research&nelat=51.95442&nelng=1.53568&swlat=51.013754&swlng=-2.57869&view=species&iconic_taxa=Aves';

  fetchPlaces: () => {
    const nyLng = -74.007233;
    const nyLat = 40.713051;

    const url =
      'https://api.inaturalist.org' +
      '/v1/places/nearby' +
      `?nelat=${nyLat}` +
      `&nelng=${nyLng}` +
      `&swlat=${nyLat}` +
      `&swlng=${nyLng}`;

    console.log('about to fetch');
    return fetch(url).then((response) => response.json()).then((json) => {
      // TODO: do we care about `json.community`?
      return json.results.standard as Place[];
    });
  },
}

interface Place {
  admin_level: number;
  ancestor_place_ids: null;
  bbox_area: number;
  bounding_box_geojson: object;
  display_name: string;
  geometry_geojson: object;
  id: number;
  location: string;
  name: string;
  place_type: number;
  slug: string;
  uuid: string;
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
