import axios from "axios";
import prisma from "./prisma/client.js";
import { autoFetch } from "./index.js";

let cachedData = null;
let page = 1;

const fetchAnotherApi = async () => {
  const options = {
    method: "GET",
    url: `https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events/?page=${page}`,
    /* headers: auth if we need */
  };

  try {
    const response = await axios.request(options);
    cachedData = response.data;

    if (cachedData) {
      for (let event of cachedData.events) {
        const [first] = event.organizer;
        const existingEvent = await prisma.event.findUnique({ where: { id: `${event.id}` } });

        if (!existingEvent) {
          await prisma.event.create({
            data: {
              id: `${event.id}`,
              title: event.title,
              description: event.description,
              eventDate: new Date(event.date),
              organizer: first?.organizer ?? "No one",
            },
          });
        }
      }
    }
  } catch (error) {
    if (error.message.includes("Unique constraint failed")) {
      // if the id is not unique, we don't update the events
      console.log("Fine we have this data!");
    } else {
      console.error(error);
    }
  } finally {
    if (cachedData.next_rest_url) {
      page++;
      console.log("Next fetch page: ", page);
    } else {
      clearInterval(autoFetch);
      console.log("Autoload Interval cleared");
    }
  }
};

export default fetchAnotherApi;
