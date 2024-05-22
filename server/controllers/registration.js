import prisma from "../prismaClient.js";

const createRegistration = async (user, id) => {
  const created = await prisma.registration.create({
    data: {
      userId: user.id,
      eventId: id,
    },
  });
  if (created?.id) {
    console.log(`User with email ${user.email} registers for the event`);
  }
  return created;
};

const create = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  if (!body) {
    res.status(400).send("Missing request body");
  }

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    res.status(404).send("Event not found");
  }

  const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
  if (existingUser) {
    const userInThisEvent = await prisma.registration.findFirst({
      where: { userId: existingUser.id, eventId: id },
    });
    if (userInThisEvent !== null) {
      const message = "User already registered";
      console.log(message);
      res.status(400).send(message);
    } else {
      const created = await createRegistration(existingUser, id);

      res.send(created);
    }
  } else {
    const newUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        hearFrom: body.hearFrom,
        dateOfBirth: new Date(body.dateOfBirth),
      },
    });

    if (newUser && newUser.id) {
      const created = await createRegistration(newUser, id);
      res.send(created);
    }
  }
};

const readById = async (req, res) => {
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
};

export default { create, readById };
