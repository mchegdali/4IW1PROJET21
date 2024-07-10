const { getPaginationLinks } = require('../../utils/get-pagination-links'); // adjust the path as needed

describe('getPaginationLinks', () => {
  it('should return correct pagination links', () => {
    const reqUrl = 'http://example.com';
    const page = 2;
    const text = 'test';
    const pageSize = 10;
    const metadata = [{ total: 100 }];

    const result = getPaginationLinks(reqUrl, page, text, pageSize, metadata);

    expect(result.self.href).toBe(
      'http://example.com/?page=2&pageSize=10&text=test',
    );
    expect(result.last.href).toBe(
      'http://example.com/?page=10&pageSize=10&text=test',
    );
    expect(result.prev.href).toBe(
      'http://example.com/?page=1&pageSize=10&text=test',
    );
    expect(result.next.href).toBe(
      'http://example.com/?page=3&pageSize=10&text=test',
    );
  });

  it('should return null for prev if on first page', () => {
    const reqUrl = 'http://example.com';
    const page = 1;
    const text = 'test';
    const pageSize = 10;
    const metadata = [{ total: 100 }];

    const result = getPaginationLinks(reqUrl, page, text, pageSize, metadata);

    expect(result.prev).toBeNull();
  });

  it('should return null for next if on last page', () => {
    const reqUrl = 'http://example.com';
    const page = 10;
    const text = 'test';
    const pageSize = 10;
    const metadata = [{ total: 100 }];

    const result = getPaginationLinks(reqUrl, page, text, pageSize, metadata);

    expect(result.next).toBeNull();
  });
});
