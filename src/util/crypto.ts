// src/util/crypto.ts
import crypto from 'crypto';

const KEY = Buffer.from(process.env.MESSAGE_ENC_KEY || '', 'hex'); // 32 bytes hex

if (KEY.length !== 32) {
  // generate a 32-byte key once and store in env:
  // require('crypto').randomBytes(32).toString('hex')
  throw new Error('MESSAGE_ENC_KEY must be a 32-byte hex string');
}

export function encryptJSON(obj: unknown) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const json = Buffer.from(JSON.stringify(obj));
  const ciphertext = Buffer.concat([cipher.update(json), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

export function decryptJSON(enc: {
  ciphertext: string;
  iv: string;
  tag: string;
}) {
  const iv = Buffer.from(enc.iv, 'base64');
  const tag = Buffer.from(enc.tag, 'base64');
  const ciphertext = Buffer.from(enc.ciphertext, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plain.toString('utf8'));
}
