const dayjs = require('dayjs');
const jose = require('jose');
const authConfig = require('../config/auth.config');

async function generateAccessToken(user) {
  const issuedAt = dayjs();
  const issuedAtTimestamp = issuedAt.unix();
  const accessTokenExpiredAt = issuedAt.add(60, 'minute').unix();

  const accessTokenSign = new jose.SignJWT({
    email: user.email,
  })
    .setSubject(user.id)
    .setIssuedAt(issuedAtTimestamp)
    .setExpirationTime(accessTokenExpiredAt)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setNotBefore(issuedAtTimestamp);

  const accessToken = await accessTokenSign.sign(authConfig.accessTokenSecret);
  return { issuedAt, accessToken };
}

module.exports = generateAccessToken;
