import { NesContainer } from "./NesContainer";

// TODO: is this list exhaustive?
const iconicTaxa = [
  'Animalia',
  'Amphibia',
  'Arachnida',
  'Aves',
  'Chromista',
  'Fungi',
  'Insecta',
  'Mammalia',
  'Mollusca',
  'Reptilia',
  'Plantae',
];

export const SelectTaxaCategoryStep = ({ onSelect }: { onSelect: (string) => void }) => {
  const buttons = iconicTaxa.map((iconicTaxon, i) => {
    return (
      <div key={i}>
        <button className="nes-btn mb1" onClick={() => onSelect(iconicTaxon)}>{iconicTaxon}</button>
      </div>
    );
  });
  return (
    <NesContainer title={`Taxa Category`}>
      {buttons}
    </NesContainer>
  );
};
