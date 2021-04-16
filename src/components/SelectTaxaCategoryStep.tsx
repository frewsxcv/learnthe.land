import { NesContainer } from "./NesContainer";
import Button from "react-bootstrap/Button";

// TODO: is this list exhaustive?
const iconicTaxa = [
  "Animalia",
  "Amphibia",
  "Arachnida",
  "Aves",
  "Chromista",
  "Fungi",
  "Insecta",
  "Mammalia",
  "Mollusca",
  "Reptilia",
  "Plantae",
];

export const SelectTaxaCategoryStep = ({
  onSelect,
}: {
  onSelect: (string: string) => void;
}) => {
  const buttons = iconicTaxa.map((iconicTaxon, i) => {
    return (
      <div key={i}>
        <Button className="mb1" onClick={() => onSelect(iconicTaxon)}>
          {iconicTaxon}
        </Button>
      </div>
    );
  });
  return <NesContainer title={`Taxa Category`}>{buttons}</NesContainer>;
};
