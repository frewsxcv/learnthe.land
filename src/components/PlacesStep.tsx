import { iNaturalistApi, Place } from '../inaturalist';
import { Location } from '../location';
import * as React from 'react';
import { fakePlace } from '../inaturalist-fake-data';

export const PlacesStep = ({
  offlineMode,
  location,
  onLoad,
}: {
  offlineMode: boolean;
  location: Location;
  onLoad: (places: Place[]) => void;
}) => {
  if (offlineMode) {
    window.setTimeout(() => onLoad([fakePlace]), 300);
    return loading;
  }
  iNaturalistApi.fetchPlaces(location).then((nearby) => {
    onLoad(nearby.standard);
  });
  return loading;
};

const loading = <p>Loading...</p>;
