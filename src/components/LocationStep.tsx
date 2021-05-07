import { NesContainer } from "./NesContainer";
import * as React from "react";

export const LocationStep = ({
  onLocation,
}: {
  onLocation: (location: Location) => void;
}) => {
  const result = navigator.geolocation.getCurrentPosition(
    (result) => {
      onLocation({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      });
    },
    () => {
      <p>Could not fetch location</p>
    }
  );
  return (
    <NesContainer title="Places">
      <p>Request location...</p>
    </NesContainer>
  );
};

export interface Location {
  longitude: number;
  latitude: number;
}
