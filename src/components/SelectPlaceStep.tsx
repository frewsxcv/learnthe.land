import { Place } from "../inaturalist";
import { Frame } from "./Frame";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import * as React from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Col, Row } from "react-bootstrap";

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
      <Col xs={12} sm={6} lg={4} key={i}>
        <Card style={{marginBottom: "20px"}}>
          <Card.Header>{place.display_name}</Card.Header>
          <Card.Body>
            <div className="d-grid gap-3" key={i}>
              <div style={{ height: "150px", display: "flex" }}>
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
              <Button onClick={onClick}>Select</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  });

  return (
    <Frame title="Places">
      <Row>
        {placesElems}
      </Row>
    </Frame>
  );
};

const PlaceLayer = ({ place }: { place: Place }) => {
  const map = useMap();
  return (
    <GeoJSON
      data={place.geometry_geojson as any}
      onEachFeature={(_feature, layer) => {
        map.fitBounds((layer as any).getBounds());
      }}
    />
  );
};
