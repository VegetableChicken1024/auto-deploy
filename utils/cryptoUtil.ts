import crypto from "crypto";
const algorithm = "aes-256-cbc";
const key = "asdfghjklzxcvbnmqwertyuiop123456";
const iv = "asdfghjklzxcvbnm";
const cipher = crypto.createCipheriv(algorithm, key, iv);
export const encrypt = (text: string) => {
  let encrypted = cipher.update(text, "utf8", "hex");
  return (encrypted += cipher.final("hex"));
};

export const decrypt = (encrypted: string) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  return (decrypted += decipher.final("utf8"));
};
