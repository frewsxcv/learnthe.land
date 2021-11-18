import { Location } from '../location';
import * as React from 'react';

export const LocationStep = ({
  onLocation,
  offlineMode,
}: {
  onLocation: (location: Location) => void;
  offlineMode: boolean;
}) => {
  if (offlineMode) {
    window.setTimeout(() => {
      onLocation({
        latitude: 0,
        longitude: 0,
      });
    }, 300);
    return loading;
  }

  const result = navigator.geolocation.getCurrentPosition(
    (result) => {
      onLocation({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      });
    },
    () => {
      <p>Could not fetch location</p>;
    }
  );
  return loading;
};

const loading = <p>Request location...</p>;
