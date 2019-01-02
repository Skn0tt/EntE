import * as React from "react";
import { CreateSlotDto } from "ente-types";
import { List } from "@material-ui/core";
import SlotListItem from "./SlotListItem";

interface CreateSlotListProps {
  slots: CreateSlotDto[];
  onRemove: (c: CreateSlotDto) => void;
}

export const CreateSlotList: React.SFC<CreateSlotListProps> = props => {
  const { slots, onRemove } = props;

  return (
    <List>
      {slots.map(slot => (
        <SlotListItem slot={slot} onRemove={() => onRemove(slot)} />
      ))}
    </List>
  );
};
