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

  /*
  const extraImages = [];
  iNaturalistApi.fetchObservationsForTaxon(species.taxon.id).then(results => {
    for (const result of results) {
      // e.g. https://inaturalist-open-data.s3.amazonaws.com/photos/109982257/square.jpg?1610506716
      const squarePhotoUrl: string = result.photos[0].url;
      // e.g. https://inaturalist-open-data.s3.amazonaws.com/photos/109982257/original.jpg?1610506716
      const originalPhotoUrl = squarePhotoUrl.replace("square", "original");
      extraImages.push(originalPhotoUrl);
    }
    console.log(extraImages);
     });
  */

  return (
    <NesContainer title={`Flashcards`}>
      <div style={{ border: "1px solid black" }}>
        <Flicking gap={20}>
          <img
            width={300}
            height={400}
            style={{ pointerEvents: "none" }}
            src={originalPhotoUrl}
            alt=""
          />
          <img
            width={800}
            height={400}
            style={{ pointerEvents: "none" }}
            src={originalPhotoUrl}
            alt=""
          />
        </Flicking>
      </div>
      {lower}
    </NesContainer>
  );
};

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
