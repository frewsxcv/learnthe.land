import * as React from 'react';
import { CSSProperties, useRef, useState } from 'react';
import { iNaturalistApi, SpeciesCount, Taxon } from '../inaturalist';
import Flicking from '@egjs/react-flicking';
import { Plugin } from '@egjs/react-flicking';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ButtonGroup, Col, Container, Navbar, Row } from 'react-bootstrap';
import { Fade } from '@egjs/flicking-plugins';
import {
  ArrowLeft,
  ArrowRight,
  EyeFill,
  HandThumbsUp,
  HandThumbsDown,
} from 'react-bootstrap-icons';
import { FlashcardData, FlashcardImage } from '../flashcard-data';
import { FlashcardRating } from '../flashcard-rating';
import '@egjs/flicking/dist/flicking.css';

const FlashcardPreviousImageButton = ({
  disabled,
  onClick,
  style,
}: {
  disabled: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) => {
  return (
    <Button disabled={disabled} variant="outline-secondary" onClick={onClick} style={style}>
      <ArrowLeft />
      &nbsp; Prev. image
    </Button>
  );
};

const FlashcardNextImageButton = ({
  disabled,
  onClick,
  style,
}: {
  disabled: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) => {
  return (
    <Button disabled={disabled} variant="outline-secondary" onClick={onClick} style={style}>
      Next image &nbsp;
      <ArrowRight />
    </Button>
  );
};

const FlashcardButtons = ({
  revealed,
  onPrevClick,
  onNextClick,
  onReveal,
  onRateClick,
  disabled,
  nextPrevDisabled,
}: {
  revealed: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  onReveal?: () => void;
  onRateClick?: (rating: FlashcardRating) => void;
  disabled?: boolean;
  nextPrevDisabled?: boolean;
}) => {
  let middle;
  if (revealed) {
    middle = (
      <>
        <Button
          style={{ width: '50%' }}
          variant="danger"
          disabled={disabled}
          onClick={() => onRateClick && onRateClick('dontknow')}
        >
          <>
            <HandThumbsDown /> Didn’t know it
          </>
        </Button>
        <Button
          style={{ width: '50%' }}
          variant="success"
          disabled={disabled}
          onClick={() => onRateClick && onRateClick('know')}
        >
          <>
            <HandThumbsUp /> Knew it
          </>
        </Button>
      </>
    );
  } else {
    middle = (
      <Button disabled={disabled} onClick={onReveal}>
        <>
          <EyeFill />
          &nbsp;Reveal
        </>
      </Button>
    );
  }
  const nextPrevButtonsDisabled = !!disabled || !!nextPrevDisabled;
  return (
    <Container>
      <Row className="d-lg-none w-100">
        <Col xs={12} className="d-grid">
          <ButtonGroup>
            <FlashcardPreviousImageButton
              style={{ width: '50%' }}
              disabled={nextPrevButtonsDisabled}
              onClick={onPrevClick}
            />
            <FlashcardNextImageButton
              style={{ width: '50%' }}
              disabled={nextPrevButtonsDisabled}
              onClick={onNextClick}
            />
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="w-100">
        <Col lg={3} xl={2} className="d-none d-lg-grid">
          <FlashcardPreviousImageButton disabled={nextPrevButtonsDisabled} onClick={onPrevClick} />
        </Col>
        <Col lg={6} xl={{ span: 6, offset: 1 }} className="d-grid">
          <ButtonGroup>{middle}</ButtonGroup>
        </Col>
        <Col lg={3} xl={{ span: 2, offset: 1 }} className="d-none d-lg-grid">
          <FlashcardNextImageButton disabled={nextPrevButtonsDisabled} onClick={onNextClick} />
        </Col>
      </Row>
    </Container>
  );
};

export const Flashcard = ({
  offlineMode,
  revealed,
  data,
  onReveal,
  onRateClick,
  onLoadImageMetadata,
  onLoadAncestors,
}: {
  offlineMode: boolean;
  revealed: boolean;
  data: FlashcardData;
  onReveal: () => void;
  onRateClick: (rating: FlashcardRating) => void;
  onLoadImageMetadata: (images: FlashcardImage[]) => void;
  onLoadAncestors: (taxon: Taxon[]) => void;
}) => {
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const flickingRef = useRef<Flicking>(null);

  let inner: JSX.Element;
  let speciesFacts;

  if (data.images.length === 0) {
    loadImageMetadata(offlineMode, data.species).then((flashcardImages) => {
      onLoadImageMetadata(flashcardImages);
    });

    inner = <p style={{ height: FLASHCARD_IMAGE_HEIGHT, margin: 0 }}>Loading images...</p>;
  } else if (data.ancestors === undefined) {
    iNaturalistApi.fetchAncestorTaxa(data.species.taxon).then(onLoadAncestors);
    inner = <p style={{ height: FLASHCARD_IMAGE_HEIGHT, margin: 0 }}>Loading ancestors...</p>;
  } else {
    const imageElems = data.images.map((image, i) => {
      const width = (image.width * FLASHCARD_IMAGE_HEIGHT) / image.height;
      return (
        <div style={{ position: 'relative' }} key={i}>
          <img
            width={width}
            height={FLASHCARD_IMAGE_HEIGHT}
            style={{ pointerEvents: 'none', marginRight: '5px', marginLeft: '5px' }}
            src={image.src}
            alt=""
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '4px',
              fontSize: '7px',
              padding: '2px 4px',
              background: 'rgba(0, 0, 0, 50%)',
              color: 'white',
              transform: 'translate(-50%, 0)',
              whiteSpace: 'nowrap',
            }}
          >
            {image.attribution}
          </div>
        </div>
      );
    });

    const flickingPlugins: Plugin[] = [new Fade()];

    // Without this, seeing the same flashcard images again would have misaligned images for some reason
    if (!isMoving) {
      flickingRef.current?.resize();
    }

    inner = (
      <Flicking
        onMoveStart={() => {
          setIsMoving(true);
        }}
        onMoveEnd={() => {
          setIsMoving(false);
        }}
        circular={true}
        ref={flickingRef}
        plugins={flickingPlugins}
      >
        {imageElems}
      </Flicking>
    );

    speciesFacts = revealed ? (
      <SpeciesFacts species={data.species} ancestors={data.ancestors} />
    ) : null;
  }

  return (
    <>
      <div className="d-grid gap-3 py-4" style={{ backgroundColor: 'white', position: 'relative' }}>
        {inner}
        {speciesFacts}
      </div>
      <Navbar variant="light" bg="light" className="border-top" expand={false}>
        <FlashcardButtons
          revealed={revealed}
          disabled={data.images.length === 0}
          onPrevClick={() => flickingRef.current?.prev()}
          onNextClick={() => flickingRef.current?.next()}
          onRateClick={(rating: FlashcardRating) => onRateClick(rating)}
          onReveal={onReveal}
          nextPrevDisabled={isMoving}
        />
      </Navbar>
    </>
  );
};

const loadImageMetadata: (
  offlineMode: boolean,
  species: SpeciesCount
) => Promise<FlashcardImage[]> = (offlineMode, species) => {
  const originalPhotoUrl = species.taxon.default_photo.medium_url.replace('medium', 'original');
  const promises = [loadFlashcardImage(originalPhotoUrl, species.taxon.default_photo.attribution)];
  if (!offlineMode) {
    promises.push(loadINaturalistObservationFlashcardImages(species));
  }
  return Promise.all(promises).then((result) => {
    return Array.prototype.concat.apply([], result);
  });
};

const loadFlashcardImage: (imageSrc: string, attribution: string) => Promise<FlashcardImage[]> = (
  imageSrc,
  attribution
) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve([
        {
          src: imageSrc,
          width: image.width,
          height: image.height,
          attribution,
        },
      ]);
    };
    image.src = imageSrc;
  });
};

const loadINaturalistObservationFlashcardImages: (
  species: SpeciesCount
) => Promise<FlashcardImage[]> = (species) => {
  return iNaturalistApi.fetchObservationsForTaxon(species.taxon.id).then((results) => {
    const extraImages: FlashcardImage[] = [];
    for (const result of results) {
      // e.g. https://inaturalist-open-data.s3.amazonaws.com/photos/109982257/square.jpg?1610506716
      const squarePhotoUrl: string = result.photos[0].url;
      // e.g. https://inaturalist-open-data.s3.amazonaws.com/photos/109982257/original.jpg?1610506716
      const originalPhotoUrl = squarePhotoUrl.replace('square', 'original');
      extraImages.push({
        src: originalPhotoUrl,
        height: result.photos[0].original_dimensions.height,
        width: result.photos[0].original_dimensions.width,
        attribution: result.photos[0].attribution,
      });
    }
    return extraImages;
  });
};

const SpeciesFacts = ({ species, ancestors }: { species: SpeciesCount; ancestors: Taxon[] }) => {
  return (
    <Card
      style={{
        position: 'absolute',
        zIndex: ' 10',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        top: '50%',
      }}
    >
      <Card.Body>
        <Row>
          <Col>
            <div className="d-grid gap-3">
              <SpeciesName species={species} />
              <Hyperlinks species={species} />
            </div>
          </Col>
          <Col>
            <TaxonAncestors ancestors={ancestors} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const taxonUrl = (id: number) => `https://www.inaturalist.org/taxa/${id}`;

const TaxonAncestors = ({ ancestors }: { ancestors: Taxon[] }) => {
  const rows = ancestors.map((ancestorTaxon, i) => {
    const commonName =
      ancestorTaxon.preferred_common_name && `(${ancestorTaxon.preferred_common_name})`;
    return (
      <li key={i}>
        <a href={taxonUrl(ancestorTaxon.id)} about="_blank">
          <small>
            {ancestorTaxon.name} {commonName}
            <br />
            {ancestorTaxon.rank}
          </small>
        </a>
      </li>
    );
  });
  return <ul>{rows}</ul>;
};

const SpeciesName = ({ species }: { species: SpeciesCount }) => {
  const taxonName = <em>{capitalizeFirstLetter(species.taxon.name)}</em>;
  if (species.taxon.preferred_common_name) {
    return (
      <>
        <div>{capitalizeFirstLetter(species.taxon.preferred_common_name)}</div>
        <div className="text-secondary">({taxonName})</div>
      </>
    );
  } else {
    return (
      <>
        <div>{taxonName}</div>
      </>
    );
  }
};

const FLASHCARD_IMAGE_HEIGHT = 400;

const Hyperlinks = ({ species }: { species: SpeciesCount }) => {
  const iNaturalistUrl = `https://www.inaturalist.org/taxa/${species.taxon.id}`;
  const iNaturalistAnchor = <HyperlinkButton href={iNaturalistUrl}>iNaturalist</HyperlinkButton>;

  const wikipediaUrl = species.taxon.wikipedia_url;
  const wikipediaAnchor = wikipediaUrl && (
    <HyperlinkButton href={wikipediaUrl}>Wikipedia</HyperlinkButton>
  );

  return wikipediaAnchor ? (
    <div>
      {iNaturalistAnchor} {wikipediaAnchor}
    </div>
  ) : (
    <div>{iNaturalistAnchor}</div>
  );
};

const HyperlinkButton = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Button size="sm" variant="outline-secondary" href={href} target="_blank">
      {children}
    </Button>
  );
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
