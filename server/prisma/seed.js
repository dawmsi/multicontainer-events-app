import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function seed() {
  await prisma.registration.deleteMany();
  await prisma.user.deleteMany();
  await prisma.event.deleteMany();

  const user1 = await prisma.user.create({
    data: { fullName: "Deni", email: "deni@mail.com", hearFrom: "Found Myself" },
  });

  const user2 = await prisma.user.create({
    data: { fullName: "Nata", email: "nata@mail.com", hearFrom: "Found Myself" },
  });

  const user3 = await prisma.user.create({
    data: { fullName: "Bodya", email: "bodya@mail.com", hearFrom: "Found Myself" },
  });

  const user4 = await prisma.user.create({
    data: { fullName: "Dima", email: "dima@mail.com", hearFrom: "Found Myself" },
  });

  const user5 = await prisma.user.create({
    data: { fullName: "Oleh", email: "oleh@mail.com", hearFrom: "Found Myself" },
  });

  const user6 = await prisma.user.create({
    data: { fullName: "Kostya", email: "kostya@mail.com", hearFrom: "Found Myself" },
  });

  const event1 = await prisma.event.create({
    data: {
      title: "Learn Rust",
      description: "Webinar look at basic programing on rust",
      eventDate: new Date(),
      organizer: "BigCompany",
    },
  });

  await prisma.event.create({
    data: {
      title: "Learn C++",
      description: "Webinar look at basic programing on C++",
      organizer: "BigerCompany",
      eventDate: new Date(),
    },
  });

  await prisma.event.create({
    data: {
      title: "Learn C#",
      description: "Webinar look at basic programing on C#",
      organizer: "BigerCompanyGame",
      eventDate: new Date(),
    },
  });

  await prisma.event.create({
    data: {
      title: "Learn Python",
      description: "Webinar look at basic programing on Python",
      organizer: "MyBickIsBick",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });
  await prisma.event.create({
    data: {
      title: "X Auto Load",
      description: "X Auto Load",
      organizer: "X Auto Load",
      eventDate: new Date(),
    },
  });

  //registations

  await prisma.registration.create({
    data: {
      userId: user1.id,
      eventId: event1.id,
      date: new Date("2024-05-17T12:55:12.873Z"),
    },
  });

  await prisma.registration.create({
    data: {
      userId: user6.id,
      eventId: event1.id,
      date: new Date("2024-05-18T12:55:12.873Z"),
    },
  });

  await prisma.registration.create({
    data: {
      userId: user2.id,
      eventId: event1.id,
      date: new Date("2024-05-17T12:55:12.873Z"),
    },
  });

  await prisma.registration.create({
    data: {
      userId: user3.id,
      eventId: event1.id,
      date: new Date("2024-05-18T12:55:12.873Z"),
    },
  });

  await prisma.registration.create({
    data: {
      userId: user4.id,
      eventId: event1.id,
      date: new Date("2024-05-19T12:55:12.873Z"),
    },
  });

  await prisma.registration.create({
    data: {
      userId: user5.id,
      eventId: event1.id,
      date: new Date("2024-05-20T12:55:12.873Z"),
    },
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
