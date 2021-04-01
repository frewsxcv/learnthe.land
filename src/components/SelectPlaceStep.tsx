import { Place } from "../inaturalist";
import { NesContainer } from "./NesContainer";

export const SelectPlaceStep = ({
  places,
  onSelectPlace,
}: {
  places: Place[];
  onSelectPlace: (place: Place) => void;
}) => {
  const placesElems = places.map((place, i) => {
    const onClick = () => {
      onSelectPlace(place);
    };
    return (
      <div key={i}>
        <button className="nes-btn mb1" onClick={onClick}>
          {place.display_name}
        </button>
      </div>
    );
  });

  return <NesContainer title="Places">{placesElems}</NesContainer>;
};
