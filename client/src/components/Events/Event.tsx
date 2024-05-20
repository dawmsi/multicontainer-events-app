import { Link } from "react-router-dom";
import { EventItem } from "../../interfaces";
import { memo } from "react";

// eslint-disable-next-line react-refresh/only-export-components
function Event({ id, title, description, organizer, eventDate }: EventItem) {
  const [date, rest] = eventDate.split("T");
  const [time] = rest.split(".");

  return (
    <div
      className={`card w-80 bg-base-100 shadow-xl ${
        title.includes("Rust") && "border-2 border-accent"
      }`}
    >
      <article className="card-body">
        <h3 className="card-title">{title}</h3>
        <p>{description}</p>
        <p>{organizer}</p>
        <p className="flex flex-wrap gap-2">
          <time dateTime={date}>{date}</time>
          <b>
            <time dateTime={time}>{time.substring(0, 5)}</time>
          </b>
        </p>

        <div className="card-actions justify-between">
          <Link className="btn  btn-neutral " to={`/register/${id}`}>
            Register
          </Link>
          <Link
            className="btn  btn-neutral dark:btn-accent"
            to={`/event/${id}`}
          >
            View
          </Link>
        </div>
      </article>
    </div>
  );
}

const memoizeComponent = memo(Event);

export default memoizeComponent;
