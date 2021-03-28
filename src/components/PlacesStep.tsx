import { iNaturalistApi, Place } from "../inaturalist";
import { NesContainer } from "./NesContainer";

export const PlacesStep = ({ onPlaces }: { onPlaces: (places: Place[]) => void }) => {
  iNaturalistApi.fetchPlaces(location).then(places => {
    onPlaces(places);
  });
  return (
    <NesContainer title="Places">
      <p>Loading...</p>
    </NesContainer>
  );
};
