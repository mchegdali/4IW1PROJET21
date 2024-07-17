const dayjs = require('dayjs');
const jose = require('jose');
const generateRefreshToken = require('../../utils/generate-refresh-token');
const authConfig = require('../../config/auth.config');

jest.mock('jose');
jest.mock('../../config/auth.config', () => ({
  refreshTokenSecret: 'mockSecret',
}));

describe('generateRefreshToken', () => {
  const mockUser = { id: 'user123' };
  const mockSignJWT = {
    setSubject: jest.fn().mockReturnThis(),
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    setNotBefore: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mockRefreshToken'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jose.SignJWT.mockReturnValue(mockSignJWT);
  });

  it('should generate a refresh token with default issuedAt', async () => {
    const result = await generateRefreshToken(mockUser);

    expect(jose.SignJWT).toHaveBeenCalled();
    expect(mockSignJWT.setSubject).toHaveBeenCalledWith(mockUser.id);
    expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({
      alg: 'HS256',
      typ: 'JWT',
    });
    expect(mockSignJWT.setIssuedAt).toHaveBeenCalled();
    expect(mockSignJWT.setExpirationTime).toHaveBeenCalled();
    expect(mockSignJWT.setNotBefore).toHaveBeenCalled();
    expect(mockSignJWT.sign).toHaveBeenCalledWith(
      authConfig.refreshTokenSecret,
    );
    expect(result).toBe('mockRefreshToken');
  });

  it('should generate a refresh token with provided issuedAt', async () => {
    const mockIssuedAt = dayjs('2023-01-01');
    const mockIssuedAtTimestamp = mockIssuedAt.unix();
    const result = await generateRefreshToken(mockUser, mockIssuedAt);

    expect(jose.SignJWT).toHaveBeenCalled();
    expect(mockSignJWT.setSubject).toHaveBeenCalledWith(mockUser.id);
    expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({
      alg: 'HS256',
      typ: 'JWT',
    });
    expect(mockSignJWT.setIssuedAt).toHaveBeenCalledWith(mockIssuedAtTimestamp);
    expect(mockSignJWT.setExpirationTime).toHaveBeenCalledWith(
      mockIssuedAt.add(30, 'day').unix(),
    );
    expect(mockSignJWT.setNotBefore).toHaveBeenCalledWith(
      mockIssuedAtTimestamp,
    );
    expect(mockSignJWT.sign).toHaveBeenCalledWith(
      authConfig.refreshTokenSecret,
    );
    expect(result).toBe('mockRefreshToken');
  });

  it('should throw an error if signing fails', async () => {
    mockSignJWT.sign.mockRejectedValue(new Error('Signing failed'));

    await expect(generateRefreshToken(mockUser)).rejects.toThrow(
      'Signing failed',
    );
  });
});
