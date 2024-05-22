import { LIMIT } from "../config.js";
import prisma from "../prisma/client.js";
import { Prisma } from "@prisma/client";
import { getPaginatedResults, getPagination } from "../utils/pagination.js";

const read = async (req, res) => {
  const { search, page: pageNumber, limit: pageCount, eventId } = req.query;

  const page = Number(pageNumber) || 1;
  const limit = Number(pageCount) || LIMIT;

  const searchQuery = [
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
  ];

  const FMOW = {
    OR: search ? searchQuery : undefined,
    registrations: {
      some: { eventId: eventId },
    },
  };

  const FMO = {
    where: FMOW,
    select: {
      id: true,
      fullName: true,
      fullName: true,
      email: true,
      dateOfBirth: true,
      hearFrom: true,
    },
    orderBy: { number: "desc" },
    ...getPagination(page, limit),
  };

  const [results, count] = await Promise.all([
    prisma.user.findMany(FMO),
    prisma.user.count({
      where: FMOW,
    }),
  ]);

  if (results && count) {
    res.send(getPaginatedResults(results, count, page, limit));
  }
};

const readCount = async (condition = {}) => {
  return prisma.user.count(condition);
};

export default { read, readCount };
