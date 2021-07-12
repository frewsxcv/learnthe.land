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

const loadFlashcardImage: (imageSrc: string) => Promise<FlashcardImage[]> = (
  imageSrc
) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve([
        {
          src: imageSrc,
          width: image.width,
          height: image.height,
        },
      ]);
    };
    image.src = imageSrc;
  });
};

const loadINaturalistObservationFlashcardImages: (
  species: SpeciesCount
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
  const promises = [loadFlashcardImage(originalPhotoUrl)];
  if (!offlineMode) {
    promises.push(loadINaturalistObservationFlashcardImages(species));
  }
  return Promise.all(promises).then((result) => {
    return Array.prototype.concat.apply([], result);
  });
};

const FlashcardPreviousImageButton = ({
  flickingRef,
  disabled,
}: {
  flickingRef: MutableRefObject<Flicking>,
  disabled: boolean,
}) => {
  return (
    <Button disabled={disabled} variant='outline-secondary' onClick={() => flickingRef.current.prev()}>
      <ArrowLeft />&nbsp;
      Previous image
    </Button>
  );
};

const FlashcardNextImageButton = ({
  flickingRef,
  disabled,
}: {
  flickingRef: MutableRefObject<Flicking>,
  disabled: boolean,
}) => {
  return (
    <Button disabled={disabled} variant='outline-secondary' onClick={() => flickingRef.current.next()}>
      Next image
      &nbsp;<ArrowRight />
    </Button>
  );
};

const FlashcardButtons = ({
  revealed,
  flickingRef,
  onReveal,
  onNext,
  nextPrevDisabled,
}: {
  revealed: boolean,
  flickingRef: MutableRefObject<Flicking>,
  onReveal: () => void;
  onNext: () => void;
  nextPrevDisabled: boolean;
}) => {
  const middleButtonStyle = { flexBasis: '33%' };
  return revealed ? (
    <div className="d-grid gap-3">
      <ButtonGroup>
        <FlashcardPreviousImageButton disabled={nextPrevDisabled} flickingRef={flickingRef} />
        <Button style={middleButtonStyle} onClick={onNext}>
          <Stack />&nbsp;
          Next flashcard
        </Button>
        <FlashcardNextImageButton disabled={nextPrevDisabled} flickingRef={flickingRef} />
      </ButtonGroup>
    </div>
  ) : (
    <ButtonGroup>
      <FlashcardPreviousImageButton disabled={nextPrevDisabled} flickingRef={flickingRef} />
      <Button style={middleButtonStyle} onClick={() => onReveal()}>
        <EyeFill />&nbsp;
        Reveal flashcard
      </Button>
      <FlashcardNextImageButton disabled={nextPrevDisabled} flickingRef={flickingRef} />
    </ButtonGroup>
  );
};

export const Flashcard = ({
  offlineMode,
  revealed,
  species,
  onReveal,
  onNext,
}: {
  offlineMode: boolean;
  revealed: boolean;
  species: SpeciesCount;
  onReveal: () => void;
  onNext: () => void;
}) => {
  const [images, setImages] = useState<FlashcardImage[]>([]);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const flickingRef = useRef<Flicking>();

  if (images.length === 0) {
    loadImages(offlineMode, species).then((flashcardImages) => {
      shuffleArray(flashcardImages);
      setImages(flashcardImages);
    });

    return (
      <Frame title={`Flashcards`}>
        <Card>
          <Card.Body>
            <p style={{ height: FLASHCARD_IMAGE_HEIGHT, margin: 0 }}>Loading images...</p>
          </Card.Body>
        </Card>
      </Frame>
    );
  }


  const imageElems = images.map((image, i) => {
    const width = (image.width * FLASHCARD_IMAGE_HEIGHT) / image.height;
    return (
      <img
        key={i}
        width={width}
        height={FLASHCARD_IMAGE_HEIGHT}
        style={{ pointerEvents: "none", marginRight: "5px", marginLeft: "5px" }}
        src={image.src}
        alt=""
      />
    );
  });

  const flickingPlugins: Plugin[] = [new Fade()];

  const speciesFacts = revealed ? (<SpeciesFacts species={species} />) : null;

  return (
    <Frame title={`Flashcards`}>
      <div className="d-grid gap-3">
        <Card>
          <Card.Body>
            <Flicking
              onMoveStart={() => {setIsMoving(true)}}
              onMoveEnd={() => {setIsMoving(false)}}
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
          flickingRef={flickingRef}
          onNext={() => {
            onNext();
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
  const taxonName = capitalizeFirstLetter(species.taxon.name);
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

type FlashcardRating = "know" | "dontknow";

const processScoredFlashcard = (
  flashcard,
  flashcardRating: FlashcardRating,
  flashcards
) => {
  /*
  if (user doesn't know flashcard) {
    flashcard.streak = 0;
    return
  }

  flashcard.streak += 1;

  flashcards.insert(2 ** flashcard.streak);

  if (flashcards.no_streak_count() < 5) {
    species = speciesNotInRotation.pop(0);
    flashcards.insert(species);
  }
  */
};
