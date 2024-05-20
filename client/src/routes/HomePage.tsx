import Loader from "../components/Loader";
import EventsList from "../components/Events/EventsList";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useCallback, useState } from "react";
import { EventsQuery, useGetEventsQuery } from "../services/eventsApi";

const orederKeys = ["title", "organizer", "eventDate"];

const initialQuery: EventsQuery = {
  page: 1,
  orderBy: orederKeys[1],
};

function HomePage() {
  const [query, setQuery] = useState(initialQuery);

  const { error, data, isFetching, isLoading } = useGetEventsQuery(query);

  const list = data?.results ?? [];

  const onIntersect = useCallback(() => {
    if (data?.hasMorePages) {
      setQuery((q) => ({ ...q, page: q.page + 1 }));
    }
  }, [data?.hasMorePages]);

  const [targetRef] = useIntersectionObserver({ onIntersect });

  if (error)
    return (
      <div className="flex flex-col h-full w-full justify-center items-center">
        <span className="text-error font-bold">{JSON.stringify(error)}</span>
      </div>
    );
  if (isLoading) return <Loader />;
  if (data) {
    return (
      <div className="container flex flex-col justify-center max-w-full">
        <h1 className="text-3xl p-3 mx-3">{`Events (${data.count})`}</h1>
        <div role="tablist" className="tabs tabs-md tabs-boxed max-w-sm mx-3">
          {orederKeys.map((orderKey) => (
            <button
              key={`k-${orderKey}`}
              role="tab"
              className={`tab font-bold  ${
                query.orderBy === orderKey && "bg-accent text-white"
              }`}
              onClick={() => {
                setQuery((q) => ({ ...q, page: 1, orderBy: orderKey }));
              }}
            >
              {orderKey.toUpperCase()}
            </button>
          ))}
        </div>

        <EventsList list={list} />
        <div ref={targetRef}>
          {isFetching && (
            <div className="flex w-full justify-center">
              <span className="loading text-warning loading-infinity loading-lg text-center"></span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default HomePage;
