import * as React from 'react';
import { useReducer } from 'react';
import { LocationStep } from './LocationStep';
import { PlacesStep } from './PlacesStep';
import { SelectPlaceStep } from './SelectPlaceStep';
import { SelectTaxaCategoryStep } from './SelectTaxaCategoryStep';
import { LoadAllSpeciesStep } from './LoadAllSpeciesStep';
import { Flashcard } from './Flashcard';
import { initialState } from '../state';
import { reducer } from '../reducer';

// const reactLogo = require("./../assets/img/react_logo.svg");
import './../assets/css/App.css';
// import '@egjs/flicking/dist/flicking.css'; // FIXME: Why doesn't this import the CSS?
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TopNavbars } from './TopNavbars';
import { Container } from 'react-bootstrap';
import { onSelectTaxaCategory } from '../event-handlers';

const OFFLINE_MODE = false;

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  let inner: JSX.Element;

  if (!state.location) {
    inner = (
      <Container className="py-3">
        <LocationStep
          offlineMode={OFFLINE_MODE}
          onLocation={(location) => dispatch({ type: 'LOCATION_LOADED', location })}
        />
      </Container>
    );
  } else if (!state.places) {
    inner = (
      <Container className="py-3">
        <PlacesStep
          offlineMode={OFFLINE_MODE}
          location={state.location}
          onLoad={(places) => dispatch({ type: 'PLACES_LOADED', places })}
        />
      </Container>
    );
  } else if (!state.selectedPlace) {
    inner = (
      <Container className="py-3">
        <SelectPlaceStep
          places={state.places}
          onSelectPlace={(place) => dispatch({ type: 'PLACE_SELECTED', place })}
        />
      </Container>
    );
  } else if (!state.selectedTaxaCategory) {
    inner = (
      <Container className="py-3">
        <SelectTaxaCategoryStep
          onSelect={onSelectTaxaCategory(state.selectedPlace, OFFLINE_MODE, dispatch)}
        />
      </Container>
    );
  } else if (!state.flashcards) {
    inner = (
      <Container className="py-3">
        <LoadAllSpeciesStep />
      </Container>
    );
  } else {
    inner = (
      <Flashcard
        offlineMode={OFFLINE_MODE}
        revealed={state.flashcardRevealed}
        data={state.flashcards.current}
        onReveal={() => dispatch({ type: 'REVEAL_FLASHCARD' })}
        onRateClick={(rating) => dispatch({ type: 'SCORE_FLASHCARD', flashcardRating: rating })}
        onLoadImageMetadata={(images) =>
          dispatch({ type: 'FLASHCARD_IMAGE_METADATA_LOADED', images })
        }
        onLoadAncestors={(ancestors) => dispatch({ type: 'FLASHCARD_ANCESTORS_LOADED', ancestors })}
      />
    );
  }

  return (
    <>
      <TopNavbars
        selectedPlace={state.selectedPlace}
        selectedTaxaCategory={state.selectedTaxaCategory}
        score={state.score}
      />
      {inner}
    </>
  );
};

export default App;
