import { NesContainer } from "./NesContainer";

export const LocationStep = ({ onLocation }: { onLocation: (location: Location) => void }) => {
  const result = navigator.geolocation.getCurrentPosition((result) => {
    onLocation({
      latitude: result.coords.latitude,
      longitude: result.coords.longitude,
    });
  }, () => {
    // TODO: error case
  })
  return (
    <NesContainer title="Places">
      <p>Request location...</p>
    </NesContainer>
  );
}

export interface Location {
  longitude: number;
  latitude: number;
}
