import { Algorithm } from '@node-rs/argon2';

const authConfig = {
  accessTokenSecret: new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
  refreshTokenSecret: new TextEncoder().encode(
    process.env.REFRESH_TOKEN_SECRET,
  ),
  confirmationTokenSecret: new TextEncoder().encode(
    process.env.CONFIRM_TOKEN_SECRET,
  ),
  /**
   * @type {import("@node-rs/argon2").Options}
   * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id}
   */
  hashOptions: {
    algorithm: Algorithm.Argon2id,
    parallelism: 1,
    timeCost: 3,
    salt: new TextEncoder().encode(process.env.PASSWORD_SECRET),
    memoryCost: 12288, // 12MiB
  },
};

export default authConfig;
