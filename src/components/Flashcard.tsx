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
      <p>{species.taxon.preferred_common_name}</p>
      <p>{species.taxon.name}</p>
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
