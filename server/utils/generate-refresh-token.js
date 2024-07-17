const dayjs = require('dayjs');
const jose = require('jose');
const authConfig = require('../config/auth.config');

async function generateRefreshToken(user, issuedAt = dayjs()) {
  const issuedAtTimestamp = issuedAt.unix();
  const refreshTokenExpiredAt = issuedAt.add(30, 'day').unix();

  const refreshTokenSign = new jose.SignJWT()
    .setSubject(user.id)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAtTimestamp)
    .setExpirationTime(refreshTokenExpiredAt)
    .setNotBefore(issuedAtTimestamp);

  const refreshToken = await refreshTokenSign.sign(
    authConfig.refreshTokenSecret,
  );
  return refreshToken;
}

module.exports = generateRefreshToken;
