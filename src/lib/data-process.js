export const compare = (key, order) => {
  const desc = (a, b) => {
    if (a[key] < b[key]) return 1;
    if (a[key] > b[key]) return -1;
    return 0;
  };

  const asc = (a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  };

  if (order === 'desc') {
    return desc;
  }

  if (order === 'asc') {
    return asc;
  }

  return asc;
};
