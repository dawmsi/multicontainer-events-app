import express from "express";
import cors from "cors";
import bp from "body-parser";

import { PrismaClient, Prisma } from "@prisma/client";

const PORT = 5000;
const LIMIT = 10;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bp.json());

const prisma = new PrismaClient({
  log: ["query", "error"],
});

app.get("/", async (req, res) => {
  res.send("Connected");
});

app.post("/events/create", async (req, res) => {
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
  console.log(req.body);

  if (results) {
    res.send(results);
  }
});

app.get("/registrations/:eventId/", async (req, res) => {
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

  const registrations = await prisma.registration.findMany({
    where: {
      eventId: req.params.eventId,
      date: {
        gte: sixDaysAgo,
      },
    },

    select: {
      date: true,
      id: true,
      userId: true,
      eventId: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const results = registrations.reduce((acc, registration) => {
    const date = registration.date.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date]++;
    return acc;
  }, {});

  res.send(results);
});

app.get("/events/", async (req, res) => {
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
});

app.get("/events/:id/", async (req, res) => {
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
});

app.get("/users/", async (req, res) => {
  const { search, page: pageNumber, limit: pageCount, eventId } = req.query;

  const page = Number(pageNumber) || 1;
  const limit = Number(pageCount) || LIMIT;

  const offset = (page - 1) * limit;

  const searchQuery = search
    ? [
        {
          fullName: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          email: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ]
    : undefined;

  const results = await prisma.user.findMany({
    where: {
      OR: searchQuery,
      registrations: {
        some: { eventId: eventId },
      },
    },
    skip: offset,
    take: limit,
  });

  if (results) {
    const count = await prisma.user.count({
      where: {
        OR: searchQuery,
        registrations: {
          some: { eventId: eventId },
        },
      },
    });

    const totalPages = Math.ceil(count / limit);

    const prev = page > 1 ? page - 1 : null;
    const next = page < totalPages ? page + 1 : null;
    res.status(200).send({
      count,
      prev,
      next,
      results,
    });
  }
});

app.post("/events/:id/register/", async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  if (!body) {
    res.status(400).send("Missing request body");
  }

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    res.status(404).send("Event not found");
  }

  const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
  if (existingUser) {
    const message = "User already registered";
    console.log(message);
    res.status(400).send(message);
  }

  const newUser = await prisma.user.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      hearFrom: body.hearFrom,
      dateOfBirth: new Date(body.dateOfBirth),
    },
  });

  console.log(newUser);

  if (newUser && newUser.id) {
    console.log(`User with email ${newUser.email} registers for the event`);
    const created = await prisma.registration.create({
      data: {
        userId: newUser.id,
        eventId: id,
      },
    });
    res.send(created);
  }
});

const server = app.listen(PORT, async () => {
  const address = server.address();
  console.log(`API listening on port ${address.port}`);
  try {
    const count = await prisma.user.count();
    console.log("Connected to the database! User count:", count);
    console.log(`By default app working on 'http://localhost:3050'`);
  } catch (error) {
    console.log("Error connecting to the database");
  }
});
