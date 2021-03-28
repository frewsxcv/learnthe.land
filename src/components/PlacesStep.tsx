import { iNaturalistApi, Place } from "../inaturalist";
import { Location } from "./LocationStep";
import { NesContainer } from "./NesContainer";

export const PlacesStep = ({ location, onPlaces }: { location: Location, onPlaces: (places: Place[]) => void }) => {
  iNaturalistApi.fetchPlaces(location).then(places => {
    onPlaces(places);
  });
  return (
    <NesContainer title="Places">
      <p>Loading...</p>
    </NesContainer>
  );
};
