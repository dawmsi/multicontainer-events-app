export const getPagination = (page, limit) => {
  return { skip: (page - 1) * limit, take: limit };
};

export const getPaginatedResults = (results, count, page, limit) => {
  const totalPages = Math.ceil(count / limit);
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  return {
    limit,
    count,
    prev,
    next,
    results,
  };
};
