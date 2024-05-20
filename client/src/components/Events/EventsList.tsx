import { FC } from "react";
import { EventItem } from "../../interfaces";
import Event from "./Event";

const EventsList: FC<{ list: EventItem[] }> = ({ list }) => {
  return (
    <ul className="flex flex-wrap gap-3 p-3 justify-start h-full w-full">
      {list.map((event) => (
        <li key={event.id}>
          <Event {...event} />
        </li>
      ))}
    </ul>
  );
};

export default EventsList;
