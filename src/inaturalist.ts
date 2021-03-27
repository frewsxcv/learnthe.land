export const iNaturalistApi = {
  fetchPlaces: (location) => {
    const url =
      'https://api.inaturalist.org' +
      '/v1/places/nearby' +
      `?nelat=${location.latitude}` +
      `&nelng=${location.longitude}` +
      `&swlat=${location.latitude}` +
      `&swlng=${location.longitude}`;

    return fetch(url).then((response) => response.json()).then((json) => {
      // TODO: do we care about `json.community`?
      return json.results.standard as Place[];
    });
  },

  fetchSpecies: (place: Place) => {
    const url =
      'https://api.inaturalist.org' +
      '/v1/observations/species_counts' +
      '?captive=false' +
      '&quality_grade=research' +
      `&place_id=${place.id}` +
      '&iconic_taxa=Plantae';

    return fetch(url).then((response) => response.json()).then((json) => {
      return json.results as object[];
    });
  },
}

export interface Place {
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
