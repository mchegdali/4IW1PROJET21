function getPaginationLinks(reqUrl, page, text, pageSize, metadata) {
  const lastPage = Math.ceil((metadata?.[0].total || 0) / pageSize);

  const selfUrl = new URL(reqUrl);
  selfUrl.searchParams.set('page', page);
  text && selfUrl.searchParams.set('text', text);
  selfUrl.searchParams.set('pageSize', pageSize);
  selfUrl.searchParams.sort();

  const lastUrl = new URL(reqUrl);
  lastUrl.searchParams.set('page', lastPage);
  text && lastUrl.searchParams.set('text', text);
  lastUrl.searchParams.set('pageSize', pageSize);
  lastUrl.searchParams.sort();

  let prevUrl = page - 1 === 0 ? null : new URL(reqUrl);

  if (prevUrl) {
    prevUrl.searchParams.set('page', page - 1);
    text && prevUrl.searchParams.set('text', text);
    prevUrl.searchParams.set('pageSize', pageSize);
    prevUrl.searchParams.sort();
  }

  let nextUrl = page + 1 >= lastPage ? null : new URL(reqUrl);
  if (nextUrl) {
    nextUrl.searchParams.set('page', page + 1);
    text && nextUrl.searchParams.set('text', text);
    nextUrl.searchParams.set('pageSize', pageSize);
    nextUrl.searchParams.sort();
  }
  return {
    self: { href: selfUrl.href },
    last: { href: lastUrl.href },
    prev: prevUrl ? { href: prevUrl.href } : null,
    next: nextUrl ? { href: nextUrl.href } : null,
  };
}

module.exports = {
  getPaginationLinks,
};
