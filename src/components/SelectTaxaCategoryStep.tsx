import { IconicTaxa, iconicTaxa, iconicTaxaDescription } from '../inaturalist';
import * as React from 'react';
import { SelectionGrid, SelectionGridItem } from './SelectionGrid';

export const SelectTaxaCategoryStep = ({
  onSelect,
}: {
  onSelect: (taxaCategory: IconicTaxa) => void;
}) => {
  const buttons = iconicTaxa.map((iconicTaxon, i) => {
    const header = iconicTaxaDescription[iconicTaxon]
      ? `${iconicTaxon} (${iconicTaxaDescription[iconicTaxon]})`
      : iconicTaxon;
    return (
      <SelectionGridItem
        header={header}
        onSelect={() => onSelect(iconicTaxon as IconicTaxa)}
        key={i}
      ></SelectionGridItem>
    );
  });
  return <SelectionGrid>{buttons}</SelectionGrid>;
};
