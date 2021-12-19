import { Place } from '../inaturalist';
import * as React from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { SelectionGrid, SelectionGridItem } from './SelectionGrid';
import { FeatureGroup } from 'leaflet';

export const SelectPlaceStep = ({
  places,
  onSelectPlace,
}: {
  places: Place[];
  onSelectPlace: (place: Place) => void;
}) => {
  const placesElems = places.map((place, i) => {
    const onSelect = () => {
      onSelectPlace(place);
    };
    return (
      <SelectionGridItem header={place.display_name} onSelect={onSelect} key={i}>
        <div style={{ height: '150px', display: 'flex' }}>
          <MapContainer
            attributionControl={false}
            touchZoom={false}
            tap={false}
            keyboard={false}
            boxZoom={false}
            doubleClickZoom={false}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            center={[0, 0]}
            zoom={5}
            style={{ flexGrow: 1 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <PlaceLayer place={place} />
          </MapContainer>
        </div>
      </SelectionGridItem>
    );
  });

  return <SelectionGrid>{placesElems}</SelectionGrid>;
};

const PlaceLayer = ({ place }: { place: Place }) => {
  const map = useMap();

  return (
    <GeoJSON
      data={place.geometry_geojson as any}
      onEachFeature={(_feature, layer) => {
        if (layer instanceof FeatureGroup) {
          map.fitBounds(layer.getBounds());
        } else {
          console.warn('Could not retrieve bounds of GeoJSON');
        }
      }}
    />
  );
};
