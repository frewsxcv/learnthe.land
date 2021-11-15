import { IconicTaxa, iconicTaxa } from "../inaturalist";
import * as React from "react";
import { SelectionGrid, SelectionGridItem } from "./SelectionGrid";

export const SelectTaxaCategoryStep = ({
  onSelect,
}: {
  onSelect: (taxaCategory: IconicTaxa) => void;
}) => {
  const buttons = iconicTaxa.map((iconicTaxon, i) => {
    return (
      <SelectionGridItem header={iconicTaxon} onSelect={() => onSelect(iconicTaxon as IconicTaxa)} key={i}>
      </SelectionGridItem>
    );
  });
  return (
    <SelectionGrid>
      {buttons}
    </SelectionGrid>
  );
};
