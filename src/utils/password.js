const crypto = require("crypto");
const { promisify } = require("util");

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(String(password), salt, KEY_LENGTH);

  return `${HASH_PREFIX}$${salt}$${derivedKey.toString("hex")}`;
};

const isPasswordHash = (password) => {
  return typeof password === "string" && password.startsWith(`${HASH_PREFIX}$`);
};

const verifyPassword = async (password, storedPassword) => {
  if (!isPasswordHash(storedPassword)) {
    return String(password) === String(storedPassword);
  }

  const [, salt, storedHash] = storedPassword.split("$");
  if (!salt || !storedHash) return false;

  const derivedKey = await scrypt(String(password), salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (storedBuffer.length !== derivedKey.length) return false;

  return crypto.timingSafeEqual(storedBuffer, derivedKey);
};

module.exports = { hashPassword, isPasswordHash, verifyPassword };
