import React, { useState } from "react";
import { NesContainer } from "./NesContainer";
import { iNaturalistApi, SpeciesCount } from "../inaturalist";
import Flicking from "@egjs/react-flicking";

export const Flashcard = ({
  revealed,
  species,
  onReveal,
  onNext,
}: {
  revealed: boolean;
  species: SpeciesCount;
  onReveal: () => void;
  onNext: () => void;
}) => {
  const [images, setImages] = useState<FlashcardImage[]>([]);

  if (images.length === 0) {
    iNaturalistApi.fetchObservationsForTaxon(species.taxon.id).then(results => {
      const extraImages: FlashcardImage[] = [];
      for (const result of results) {
        // e.g. https://inaturalist-open-data.s3.amazonaws.com/photos/109982257/square.jpg?1610506716
        const squarePhotoUrl: string = result.photos[0].url;
        // e.g. https://inaturalist-open-data.s3.amazonaws.com/photos/109982257/original.jpg?1610506716
        const originalPhotoUrl = squarePhotoUrl.replace("square", "original");
        extraImages.push({
          src: originalPhotoUrl,
          height: result.photos[0].original_dimensions.height,
          width: result.photos[0].original_dimensions.width
        });
      }
      setImages(extraImages);
    });

    return (
      <NesContainer title={`Flashcards`}>
        <p>Loading images...</p>
      </NesContainer>
    );
  }

  const lower = revealed ? (
    <>
      <p>
        <button className="nes-btn" onClick={() => onNext()}>
          Next
        </button>
      </p>
      <p>{capitalizeFirstLetter(species.taxon.preferred_common_name)}</p>
      <small>
        <p>({species.taxon.name})</p>
        <Hyperlinks species={species} />
      </small>
    </>
  ) : (
    <button className="nes-btn" onClick={() => onReveal()}>
      Reveal
    </button>
  );

  const originalPhotoUrl = species.taxon.default_photo.medium_url.replace("medium", "original");

  // height1 / width1 = height2 / width2
  // width1 * height2 = height1 * width2

  // width2 = (width1 * height1) / height1

  const imageElems = images.map((image) => {
    const width = image.width * 400 / image.height;
    return (
      <img
        width={width}
        height={400}
        style={{ pointerEvents: "none" }}
        src={image.src}
        alt=""
      />
    );
  });

  return (
    <NesContainer title={`Flashcards`}>
      <div style={{ border: "1px solid black" }}>
        <Flicking gap={20}>
          {imageElems}
        </Flicking>
      </div>
      {lower}
    </NesContainer>
  );
};

type FlashcardImage = {
  src: string;
  height: number;
  width: number;
}

const Hyperlinks = ({ species }: { species: SpeciesCount }) => {
  const iNaturalistUrl = `https://www.inaturalist.org/taxa/${species.taxon.id}`;
  const iNaturalistAnchor = <a href={iNaturalistUrl}>iNaturalist</a>;

  const wikipediaUrl = species.taxon.wikipedia_url;
  const wikipediaAnchor = wikipediaUrl && <a href={wikipediaUrl}>Wikipedia</a>;

  return wikipediaAnchor ? (
    <p>
      {iNaturalistAnchor} · {wikipediaAnchor}
    </p>
  ) : (
    <p>{iNaturalistAnchor}</p>
  );
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
