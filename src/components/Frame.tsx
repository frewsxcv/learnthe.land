import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { IconicTaxa, Place } from "../inaturalist";
import { Globe } from "react-bootstrap-icons";

export const Frame = ({
  children,
  selectedPlace,
  selectedTaxaCategory,
  score,
}: {
  children: React.ReactNode;
  selectedPlace?: Place;
  selectedTaxaCategory?: IconicTaxa;
  score: number;
}) => {
  let subNavbarTitle: string;

  if (selectedPlace && selectedTaxaCategory) {
    subNavbarTitle = `${selectedPlace.name} / ${selectedTaxaCategory}`;
  } else if (selectedPlace) {
    subNavbarTitle = selectedPlace.name;
  } else {
    subNavbarTitle = '';
  }

  return (
    <>
      <Navbar expand="sm" variant="dark" bg="primary">
        <Container>
          <Navbar.Brand><Globe />&nbsp;Learn the Land</Navbar.Brand>
        </Container>
      </Navbar>
      <Navbar expand="sm" variant="light" bg="light">
        <Container>
          <div className="d-flex" style={{width: "100%"}}>
            <div>{subNavbarTitle}</div>
            <div className="ms-auto">Score: {score}</div>
          </div>
        </Container>
      </Navbar>
      <Container className="py-3">
        {children}
      </Container>
    </>
  );
};
