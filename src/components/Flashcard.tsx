import React, { MutableRefObject, useRef, useState } from "react";
import { Frame } from "./Frame";
import { iNaturalistApi, SpeciesCount } from "../inaturalist";
import Flicking from "@egjs/react-flicking";
import { Plugin } from "@egjs/react-flicking";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { ButtonGroup } from "react-bootstrap";
import { Fade } from "@egjs/flicking-plugins";
import { ArrowLeft, ArrowRight, Eye, EyeFill, Stack } from "react-bootstrap-icons";
import { FlashcardData } from "../flashcard-data";
import { FlashcardRating } from "../flashcard-rating";

const loadFlashcardImage: (imageSrc: string, attribution: string) => Promise<FlashcardImage[]> = (
  imageSrc,
  attribution,
) => {
  return new Promise((resolve, reject) => {
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
  species: SpeciesCount,
) => Promise<FlashcardImage[]> = (species) => {
  return iNaturalistApi
    .fetchObservationsForTaxon(species.taxon.id)
    .then((results) => {
      const extraImages: FlashcardImage[] = [];
      for (const result of results) {
        // e.g. https://inaturalist-open-data.s3.amazonaws.com/photos/109982257/square.jpg?1610506716
        const squarePhotoUrl: string = result.photos[0].url;
        // e.g. https://inaturalist-open-data.s3.amazonaws.com/photos/109982257/original.jpg?1610506716
        const originalPhotoUrl = squarePhotoUrl.replace("square", "original");
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

const loadImages: (
  offlineMode: boolean,
  species: SpeciesCount
) => Promise<FlashcardImage[]> = (offlineMode, species) => {
  const originalPhotoUrl = species.taxon.default_photo.medium_url.replace(
    "medium",
    "original"
  );
  const promises = [loadFlashcardImage(originalPhotoUrl, species.taxon.default_photo.attribution)];
  if (!offlineMode) {
    promises.push(loadINaturalistObservationFlashcardImages(species));
  }
  return Promise.all(promises).then((result) => {
    return Array.prototype.concat.apply([], result);
  });
};

const FlashcardPreviousImageButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean,
  onClick?: () => void,
}) => {
  return (
    <Button disabled={disabled} variant='outline-secondary' onClick={onClick}>
      <ArrowLeft />&nbsp;
      Previous image
    </Button>
  );
};

const FlashcardNextImageButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean,
  onClick?: () => void,
}) => {
  return (
    <Button disabled={disabled} variant='outline-secondary' onClick={onClick}>
      Next image
      &nbsp;<ArrowRight />
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
  revealed: boolean,
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
        <Button variant="warning" style={{ flexBasis: '16.5%' }} disabled={disabled} onClick={() => onRateClick("dontknow")}>
          <><EyeFill />&nbsp;Didn’t Know</>
        </Button>
        <Button variant="success" style={{ flexBasis: '16.5%' }} disabled={disabled} onClick={() => onRateClick("know")}>
          <><EyeFill />&nbsp;Did Know</>
        </Button>
      </>
    );
  } else {
    middle = (
      <Button style={{ flexBasis: '33%' }} disabled={disabled} onClick={onReveal}>
        <><EyeFill />&nbsp;Reveal flashcard</>
      </Button>
    );
  }
  return (
    <ButtonGroup>
      <FlashcardPreviousImageButton disabled={disabled || nextPrevDisabled} onClick={onPrevClick} />
      {middle}
      <FlashcardNextImageButton disabled={disabled || nextPrevDisabled} onClick={onNextClick} />
    </ButtonGroup>
  );
};

export const Flashcard = ({
  offlineMode,
  revealed,
  data,
  onReveal,
  onRateClick,
}: {
  offlineMode: boolean;
  revealed: boolean;
  data: FlashcardData;
  onReveal: () => void;
  onRateClick: (rating: FlashcardRating) => void;
}) => {
  const [images, setImages] = useState<FlashcardImage[]>([]);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const flickingRef = useRef<Flicking>();

  if (images.length === 0) {
    loadImages(offlineMode, data.species).then((flashcardImages) => {
      shuffleArray(flashcardImages);
      setImages(flashcardImages);
    });

    return (
      <Frame title={`Flashcards`}>
        <div className="d-grid gap-3">
          <Card>
            <Card.Body>
              <p style={{ height: FLASHCARD_IMAGE_HEIGHT, margin: 0 }}>Loading images...</p>
            </Card.Body>
          </Card>
          <FlashcardButtons revealed={false} disabled={true} />
        </div>
      </Frame>
    );
  }


  const imageElems = images.map((image, i) => {
    const width = (image.width * FLASHCARD_IMAGE_HEIGHT) / image.height;
    return (
      <div style={{position: 'relative'}} key={i}>
        <img
          width={width}
          height={FLASHCARD_IMAGE_HEIGHT}
          style={{ pointerEvents: "none", marginRight: "5px", marginLeft: "5px" }}
          src={image.src}
          alt=""
        />
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: '4px',
          fontSize: '7px',
          padding: '2px 4px',
          background: 'rgba(0, 0, 0, 50%)',
          color: 'white',
          transform: 'translate(-50%, 0)',
          whiteSpace: 'nowrap',
        }}>{image.attribution}</div>
      </div>
    );
  });

  const flickingPlugins: Plugin[] = [new Fade()];

  const speciesFacts = revealed ? (<SpeciesFacts species={data.species} />) : null;

  return (
    <Frame title={`Flashcards`}>
      <div className="d-grid gap-3">
        <Card>
          <Card.Body>
            <Flicking
              onMoveStart={() => { setIsMoving(true) }}
              onMoveEnd={() => { setIsMoving(false) }}
              circular={true}
              ref={flickingRef}
              plugins={flickingPlugins}
            >
              {imageElems}
            </Flicking>
          </Card.Body>
        </Card>
        <FlashcardButtons
          revealed={revealed}
          onPrevClick={() => flickingRef.current.prev()}
          onNextClick={() => flickingRef.current.next()}
          onRateClick={(rating: FlashcardRating) => {
            onRateClick(rating);
            setImages([]);
          }}
          onReveal={onReveal}
          nextPrevDisabled={isMoving} />
        {speciesFacts}
      </div>
    </Frame>
  );
};

const SpeciesFacts = ({ species }: { species: SpeciesCount }) => {
  return (
    <Card>
      <Card.Body>
        <div className="d-grid gap-3">
          <SpeciesName species={species} />
          <Hyperlinks species={species} />
        </div>
      </Card.Body>
    </Card>
  );
};

const SpeciesName = ({ species }: { species: SpeciesCount }) => {
  const taxonName = (
    <em>{capitalizeFirstLetter(species.taxon.name)}</em>
  );
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

type FlashcardImage = {
  src: string;
  attribution: string;
  // original height
  height: number;
  // original width
  width: number;
};

const FLASHCARD_IMAGE_HEIGHT = 400;

const Hyperlinks = ({ species }: { species: SpeciesCount }) => {
  const iNaturalistUrl = `https://www.inaturalist.org/taxa/${species.taxon.id}`;
  const iNaturalistAnchor = (
    <HyperlinkButton href={iNaturalistUrl}>iNaturalist</HyperlinkButton>
  );

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

const HyperlinkButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Button size="sm" variant="outline-secondary" href={href} target="_blank">
      {children}
    </Button>
  );
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};
