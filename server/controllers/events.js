import { LIMIT } from "../config.js";
import prisma from "../prismaClient.js";

const create = async (req, res) => {
  const { title, description, organizer } = req.body;
  if (!title || !description || !organizer) {
    console.log("Event empty");
    return;
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
  const limit = pageCount ? Number(pageCount) : LIMIT;

  const order = {};

  if (orderBy) {
    const field = orderBy.replace("-", "");
    const direction = orderBy.includes("-") ? "desc" : "asc";
    if (["title", "organizer", "eventDate"].includes(field)) {
      order[field] = direction;
    }
  }

  const offset = (page - 1) * limit;

  const results = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      eventDate: true,
      organizer: true,
    },
    skip: offset,
    take: limit,
    orderBy: Object.keys(order).length ? order : undefined,
  });

  const count = await prisma.event.count({});

  const totalPages = Math.ceil(count / limit);

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  if (results) {
    res.send({
      limit,
      count,
      prev,
      next,
      results,
    });
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
