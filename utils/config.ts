import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import yaml from "yaml";
const defaultConfigPath = join(process.cwd(), "default.yaml");
const configExists = existsSync(defaultConfigPath);
export const defaultConfig = configExists
  ? yaml.parse(readFileSync(defaultConfigPath, "utf8"))
  : {};
export const saveConfig = (config: {
  host: string;
  password: string;
  username: string;
  port: number;
}) => {
  // 将配置写入default.yaml，如果没有这个文件就新建一个
  if (!configExists) {
    writeFileSync(defaultConfigPath, "");
  }
  writeFileSync(defaultConfigPath, yaml.stringify(config));
};
