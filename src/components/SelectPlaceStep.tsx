import { Place } from "../inaturalist";
import { Frame } from "./Frame";
import Button from "react-bootstrap/Button";
import * as React from "react";

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
        <Button className="mb1" onClick={onClick}>
          {place.display_name}
        </Button>
      </div>
    );
  });

  return <Frame title="Places">{placesElems}</Frame>;
};
