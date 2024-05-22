import { LIMIT } from "../config.js";
import prisma from "../prisma/client.js";
import { getPaginatedResults, getPagination } from "../utils/pagination.js";
import { getOrder } from "../utils/order.js";

const create = async (req, res) => {
  const { title, description, organizer } = req.body;
  if (!title || !description || !organizer) {
    console.log("Event empty");
    return res.send({ message: "Event empty" });
  }
  const results = await prisma.event.create({
    data: {
      title: title,
      description: description,
      eventDate: new Date(),
      organizer: organizer,
    },
  });

  if (results) {
    res.send(results);
  }
};

const read = async (req, res) => {
  const { page: pageNumber, limit: pageCount, orderBy } = req.query;
  const page = pageNumber ? Number(pageNumber) : 1;
  const limit = pageCount ? Number(pageCount) : 10;

  const order = getOrder(orderBy, ["title", "organizer", "eventDate"]);

  const FMO = {
    select: {
      id: true,
      title: true,
      description: true,
      eventDate: true,
      organizer: true,
    },
    orderBy: Object.keys(order).length ? order : undefined,
    ...getPagination(page, limit),
  };

  const [results, count] = await Promise.all([
    prisma.event.findMany(FMO),
    prisma.event.count(),
  ]);

  if (results && count) {
    res.send(getPaginatedResults(results, count, page, limit));
  }
};

const readById = async (req, res) => {
  const event = await prisma.event.findUnique({
    where: {
      id: req.params.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      eventDate: true,
      organizer: true,
      registrations: {
        orderBy: { date: "desc" },
        take: LIMIT,
        select: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              hearFrom: true,
            },
          },
        },
      },
    },
  });

  const participantsCount = await prisma.registration.count({
    where: {
      eventId: req.params.id,
    },
  });

  if (event) {
    res.send({ ...event, participantsCount: participantsCount });
  }
};

export default { create, read, readById };
