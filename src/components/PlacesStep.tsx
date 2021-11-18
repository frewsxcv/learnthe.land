import { iNaturalistApi, Place } from "../inaturalist";
import { Location } from "../location";
import * as React from "react";

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
  iNaturalistApi.fetchPlaces(location).then((places) => {
    onLoad(places);
  });
  return loading;
};

const fakePlace: Place = {
  admin_level: 1,
  ancestor_place_ids: null,
  bbox_area: 1,
  bounding_box_geojson: { coordinates: [] },
  display_name: "Faketown",
  geometry_geojson: {},
  id: 1,
  location: "faketown",
  name: "faketown",
  place_type: 1,
  slug: "faketown",
  uuid: "16fd2706-8baf-433b-82eb-8c7fada847da",
};

const loading = (
  <p>Loading...</p>
);
