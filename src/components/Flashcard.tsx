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
  const iNaturalistUrl = `https://www.inaturalist.org/taxa/${species.taxon.id}`;
  const lower = revealed ? (
    <>
      <p>{capitalizeFirstLetter(species.taxon.preferred_common_name)}</p>
      <p>({species.taxon.name})</p>
      <p>
        <a href={iNaturalistUrl}>iNaturalist</a>
        {species.taxon.wikipedia_url && (<> · <a href={species.taxon.wikipedia_url}>Wikipedia</a></>)}
      </p>
      <button className="nes-btn" onClick={() => onNext()}>
        Next
      </button>
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
          style={{ border: "4px solid black", maxWidth: "100%" }}
          src={species.taxon.default_photo.medium_url}
          alt=""
        />
      </div>
      {lower}
    </NesContainer>
  );
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
