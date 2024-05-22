export const getOrder = (orderBy, orderArray) => {
  const order = {};
  if (orderBy) {
    const field = orderBy.replace("-", "");
    const direction = orderBy.includes("-") ? "desc" : "asc";
    if (orderArray.includes(field)) {
      order[field] = direction;
    }
  }
  return order;
};
