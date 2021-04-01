import { NesContainer } from "./NesContainer";
import { SpeciesCount } from "../inaturalist";

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

  return (
    <NesContainer title={`Flashcards`}>
      <div>
        <img
          className="mb1"
          style={{ border: "4px solid black", maxWidth: "100%", height: "400px" }}
          src={species.taxon.default_photo.medium_url}
          alt=""
        />
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
