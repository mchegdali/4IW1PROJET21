function getPaginationLinks(reqUrl, text, metadata) {
  const { page, totalPages, pageSize } = metadata ?? {};

  console.log('reqUrl', reqUrl);
  console.log('text', text);
  console.log('metadata', metadata);

  const selfUrl = new URL(reqUrl, process.env.APP_URL);
  selfUrl.searchParams.set('page', page);
  text && selfUrl.searchParams.set('text', text);
  selfUrl.searchParams.set('pageSize', pageSize);
  selfUrl.searchParams.sort();

  let lastUrl = totalPages ? new URL(reqUrl, process.env.APP_URL) : null;
  if (lastUrl) {
    lastUrl.searchParams.set('page', totalPages);
    text && lastUrl.searchParams.set('text', text);
    lastUrl.searchParams.set('pageSize', pageSize);
    lastUrl.searchParams.sort();
  }

  let prevUrl = page === 1 ? null : new URL(reqUrl, process.env.APP_URL);

  if (prevUrl) {
    prevUrl.searchParams.set('page', page - 1);
    text && prevUrl.searchParams.set('text', text);
    prevUrl.searchParams.set('pageSize', pageSize);
    prevUrl.searchParams.sort();
  }

  let nextUrl =
    page >= totalPages ? null : new URL(reqUrl, process.env.APP_URL);
  if (nextUrl) {
    nextUrl.searchParams.set('page', page + 1);
    text && nextUrl.searchParams.set('text', text);
    nextUrl.searchParams.set('pageSize', pageSize);
    nextUrl.searchParams.sort();
  }
  return {
    self: selfUrl.href,
    last: lastUrl?.href ?? null,
    prev: prevUrl?.href ?? null,
    next: nextUrl?.href ?? null,
  };
}

module.exports = {
  getPaginationLinks,
};
