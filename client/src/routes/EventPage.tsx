import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  LIMIT,
  useGetEventByIdQuery,
  useGetEventRegistationsQuery,
  useLazyGetUsersQuery
} from "../services/eventsApi";
import Loader from "../components/Loader";
import { Search } from "../components/Search";
import { ControlPages } from "../components/ControlPages";
import { useEffect } from "react";
import Table from "../components/Table";
import LineChart from "../components/LineChart";

function EventPage() {
  const { id: eventId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const getFromSearchParams = (key: string) => {
    return searchParams.get(key);
  };

  const updateSearchParams = (paramsObject) => {
    setSearchParams((prev) => {
      return { ...prev, ...paramsObject };
    });
  };

  const { error, data, isLoading } = useGetEventByIdQuery(eventId!);

  const [
    getUsers,
    {
      data: eventUsers = {
        results: data?.participants,
        count: data?.participantsCount
      },
      isLoading: waitUser,
      isFetching
    }
  ] = useLazyGetUsersQuery();

  useEffect(() => {
    getUsers({
      eventId: eventId,
      page: +searchParams.get("page"),
      search: searchParams.get("search")
    });
  }, [eventId, searchParams, getUsers]);

  const {
    error: regError,
    data: registrations,
    isLoading: isLoadReg
  } = useGetEventRegistationsQuery(eventId!);

  const date = new Date();
  date.setDate(date.getDate() + 1);
  const dateString = date.toISOString().split("T")[0];

  if (error) return <span>{JSON.stringify(error)}</span>;
  if (isLoading) return <Loader />;
  if (data) {
    const { results = [], count } = eventUsers;
    const pageCount = Math.ceil(+count / LIMIT);

    return (
      <div className="px-3">
        <h1 className="text-center text-3xl mb-2">Events</h1>
        <div className="card p-3 bg-base-100 shadow-xl">
          <section className="flex justify-between">
            <article className="card-body">
              <h1 className="card-title">
                {data.title} - {data.organizer}
              </h1>
              <p>{data.description}</p>
              <p>{data.eventDate}</p>
            </article>
            <Link className="btn btn-accent" to={`/register/${eventId}`}>
              Register
            </Link>
          </section>
          {registrations && Object.keys(registrations)?.length !== 0 && (
            <section>
              {!regError && isLoadReg ? (
                <Loader />
              ) : (
                <LineChart
                  registrations={{
                    ...registrations,
                    [`${dateString}`]: 0
                  }}
                />
              )}
            </section>
          )}
          <section aria-label="participants" className="p-3">
            <Search
              currentSearch={getFromSearchParams("search")}
              updateSearchParams={updateSearchParams}
            />
            {(waitUser || isFetching) && <Loader className="max-h-20" />}
            {!results.length ? (
              <div className="text-center text-xl font-semibold">No items</div>
            ) : (
              !isFetching &&
              eventUsers &&
              !waitUser && (
                <>
                  <div className="overflow-x-auto">
                    <Table list={results} />
                  </div>
                  <ControlPages
                    pagesCount={pageCount}
                    currentPage={getFromSearchParams("page")}
                    updateSearchParams={updateSearchParams}
                  />
                </>
              )
            )}
          </section>
        </div>
      </div>
    );
  }
}

export default EventPage;
