import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import * as React from 'react';
import { IconicTaxa, Place } from '../inaturalist';
import { Globe } from 'react-bootstrap-icons';

export const TopNavbars = ({
  selectedPlace,
  selectedTaxaCategory,
  score,
}: {
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
          <Navbar.Brand>
            <Globe />
            &nbsp;Learn the Land
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar" role="collapse">
            <Navbar.Text className="ms-auto">
              <a target="_blank" href="https://github.com/frewsxcv/learnthe.land" rel="noreferrer">
                Source
              </a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar expand="sm" variant="light" bg="light" className="border-bottom">
        <Container>
          <div className="d-flex" style={{ width: '100%' }}>
            <div>{subNavbarTitle}</div>
            <div className="ms-auto">Score: {score}</div>
          </div>
        </Container>
      </Navbar>
    </>
  );
};
