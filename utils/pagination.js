const pagination = (url, limitNumber, page, totalDocs) => {
  const prevPage = page > 1 ? parseInt(page, 0) - 1 : 1;
  const lastPage = Math.ceil(totalDocs / limitNumber);
  const nextPage =
    limitNumber * page < totalDocs ? parseInt(page, 0) + 1 : lastPage;

  const link = {
    first: `<${url}?limit=${limitNumber}&page=1>; rel="first"`,
    prev: `<${url}?limit=${limitNumber}&page=${prevPage}>; rel="prev"`,
    next: `<${url}?limit=${limitNumber}&page=${nextPage}>; rel="next"`,
    last: `<${url}?limit=${limitNumber}&page=${lastPage}>; rel="last"`,
  };

  return `${link.first}, ${link.prev}, ${link.next}, ${link.last}`;
};

module.exports = { pagination };
