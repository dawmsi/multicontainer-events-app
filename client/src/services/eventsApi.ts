import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EventItem, User } from "../interfaces";

const baseUrl = `/api/`;

export const LIMIT = 5;

interface PageResponse<TResult> {
  limit?: number;
  count: number;
  prev: number | null;
  next: number | null;
  results: TResult[];
}

interface UserResponse {
  eventId: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface EventsState {
  count: number;
  results: EventItem[];
  lastPage: number;
  hasMorePages: boolean;
}

export interface EventsQuery {
  page: number;
  orderBy: string;
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEventRegistations: builder.query<
      {
        count: number;
        prev: number | null;
        next: number | null;
        results: {
          [key: string]: number;
        };
      },
      string
    >({
      query: (id: string) => `registrations/${id}`,
      providesTags: () => [
        {
          type: "Event"
        }
      ]
    }),
    getUsers: builder.query<PageResponse<User>, UserResponse>({
      query: ({ search, page, limit, eventId }) => {
        const params = new URLSearchParams({
          search: search || "",
          page: `${page ?? 1}`,
          limit: `${limit ?? LIMIT}`,
          eventId: eventId ?? ""
        });
        return `users?${params.toString()}`;
      }
    }),
    getEvents: builder.query<EventsState, EventsQuery>({
      query(eventsQuery) {
        const params = new URLSearchParams({
          page: eventsQuery.page.toString(),
          orderBy: eventsQuery.orderBy.toString()
        });

        const query = params.toString();
        return `/events?${query}`;
      },
      transformResponse(response: PageResponse<EventItem>, _, arg) {
        return {
          count: response.count,
          results: response.results,
          lastPage: arg.page,
          hasMorePages: arg.page < response.count / response.limit
        };
      },
      serializeQueryArgs({ endpointName }) {
        return endpointName;
      },
      merge(currentCacheData, responseData) {
        if (responseData.lastPage === 1) {
          currentCacheData.results = responseData.results;
        } else {
          const newResults = responseData.results.filter(
            (result) =>
              !currentCacheData.results.some((r) => r.id === result.id)
          );
          currentCacheData.results.push(...newResults);

          // currentCacheData.results.push(...responseData.results);
        }

        currentCacheData.hasMorePages = responseData.hasMorePages;
        currentCacheData.lastPage = responseData.lastPage;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      }
    }),
    getEventById: builder.query<EventItem, string>({
      query: (id) => `events/${id}`,
      providesTags: () => [
        {
          type: "Event"
        }
      ]
    }),
    registerToEvent: builder.mutation<EventItem, { id: string; user: User }>({
      query: ({ id, user }) => ({
        url: `events/${id}/register`,
        method: "POST",
        body: user
      }),
      invalidatesTags: () => {
        return [
          {
            type: "Event"
          }
        ];
      }
    })
  })
});

export const {
  useGetEventRegistationsQuery,
  useLazyGetUsersQuery,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useRegisterToEventMutation
} = eventsApi;
