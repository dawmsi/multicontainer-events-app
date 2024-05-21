import { LIMIT } from "../config.js";
import prisma from "../prismaClient.js";
import { Prisma } from "@prisma/client";

const read = async (req, res) => {
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
    select: {
      id: true,
      fullName: true,
      fullName: true,
      email: true,
      dateOfBirth: true,
      hearFrom: true,
    },
    skip: offset,
    take: limit,
    orderBy: { number: "desc" },
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
};

const readCount = async (condition = {}) => {
  return prisma.user.count(condition);
};

export default { read, readCount };
