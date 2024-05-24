import { Algorithm } from '@node-rs/argon2';

const authConfig = {
  accessTokenSecret: new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
  refreshTokenSecret: new TextEncoder().encode(
    process.env.REFRESH_TOKEN_SECRET,
  ),
  /**
   * @type {import("@node-rs/argon2").Options}
   * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id}
   */
  hashOptions: {
    algorithm: Algorithm.Argon2id,
    parallelism: 1,
    timeCost: 2,
    salt: new TextEncoder().encode(process.env.PASSWORD_SECRET),
    memoryCost: 19 * 1024,
  },
};

export default authConfig;
