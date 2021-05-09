import { Frame } from "./Frame";
import { IconicTaxa, iconicTaxa } from "../inaturalist";
import Button from "react-bootstrap/Button";
import * as React from "react";

export const SelectTaxaCategoryStep = ({
  onSelect,
}: {
  onSelect: (taxaCategory: IconicTaxa) => void;
}) => {
  const buttons = iconicTaxa.map((iconicTaxon, i) => {
    return (
      <div key={i}>
        <Button className="mb1" onClick={() => onSelect(iconicTaxon as IconicTaxa)}>
          {iconicTaxon}
        </Button>
      </div>
    );
  });
  return <Frame title={`Taxa Category`}>{buttons}</Frame>;
};
