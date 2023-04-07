// 获取配置信息
import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import { IConfig } from "../types";
import { decrypt } from "./cryptoUtil";
export const getConfig = (configFile: string[]): IConfig => {
  const configPath = join(process.cwd(), "config");
  const config = parse(
    readFileSync(join(configPath, `${configFile}.yaml`), "utf-8")
  );
  return {
    ...config,
    password: decrypt(config.password),
  };
};

export const getOptionsCongfig = (configPaths: string[]): IConfig[] => {
  return configPaths.map(path => {
    const config = parse(readFileSync(path, "utf-8"))
    return {
      ...config,
      password: decrypt(config.password),
    }
  });
}
