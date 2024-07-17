const jose = require('jose');
const generateAccessToken = require('../../utils/generate-access-token');
const authConfig = require('../../config/auth.config');
const dayjs = require('dayjs');

jest.mock('jose');
jest.mock('../../config/auth.config', () => ({
  accessTokenSecret: 'mockSecret',
}));

describe('generateAccessToken', () => {
  const mockUser = { id: 'user123' };
  const mockSignJWT = {
    setSubject: jest.fn().mockReturnThis(),
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    setNotBefore: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mockAccessToken'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jose.SignJWT.mockReturnValue(mockSignJWT);
    jest.useFakeTimers().setSystemTime(new Date('2023-01-10T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should generate an access token with mocked system time', async () => {
    const result = await generateAccessToken(mockUser);

    const expectedIssuedAt = dayjs('2023-01-10T12:00:00Z');
    const expectedIssuedAtTimestamp = expectedIssuedAt.unix();
    const expectedExpirationTimeTimestamp = expectedIssuedAt
      .add(60, 'minute')
      .unix();

    expect(jose.SignJWT).toHaveBeenCalledWith({ email: mockUser.email });
    expect(mockSignJWT.setSubject).toHaveBeenCalledWith(mockUser.id);
    expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({
      alg: 'HS256',
      typ: 'JWT',
    });
    expect(mockSignJWT.setIssuedAt).toHaveBeenCalledWith(
      expectedIssuedAtTimestamp,
    );
    expect(mockSignJWT.setExpirationTime).toHaveBeenCalledWith(
      expectedExpirationTimeTimestamp,
    );
    expect(mockSignJWT.setNotBefore).toHaveBeenCalledWith(
      expectedIssuedAtTimestamp,
    );
    expect(mockSignJWT.sign).toHaveBeenCalledWith(authConfig.accessTokenSecret);

    expect(result).toEqual({
      accessToken: 'mockAccessToken',
      issuedAt: result.issuedAt,
    });
  });

  it('should throw an error if signing fails', async () => {
    mockSignJWT.sign.mockRejectedValue(new Error('Signing failed'));

    await expect(generateAccessToken(mockUser)).rejects.toThrow(
      'Signing failed',
    );
  });
});
