// ssh配置相关
import {
  readdirSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { extname, join } from "path";
import inquirer from "inquirer";
import { IConfig } from "../types";
import { parse, stringify } from "yaml";
import { encrypt, decrypt } from "../utils/cryptoUtil";

// 查找./config目录下的所有配置文件
const searchConfigFiles = () => {
  const configPath = join(process.cwd(), "config");
  if (!existsSync(configPath)) {
    mkdirSync(configPath);
  }
  const files = readdirSync(configPath);
  if (files.length === 0) {
    console.log("当前目录下没有配置文件，请根据后续提示创建配置");
    return [];
  } else {
    return files
      .filter((file) => extname(file) === ".yaml")
      .map((file) => file.replace(".yaml", ""));
  }
};

export const getSshConfig = async (): Promise<IConfig> => {
  // 配置文件目录路径默认为当前目录下的config文件夹
  // 不然询问项太多了
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "useExistConfig",
      message: "是否使用已有的配置文件？",
      default: true,
    },
    {
      type: "list",
      name: "configFile",
      message: "请选择配置文件",
      choices: () => searchConfigFiles(),
      when: (answers) => {
        const length = searchConfigFiles().length;
        return answers.useExistConfig && length > 0;
      },
    },
    {
      type: "input",
      name: "host",
      message: "请输入服务器地址：",
      when: (answers) => !answers.useExistConfig || !answers.configFile,
    },
    {
      type: "input",
      name: "username",
      message: "请输入服务器用户名：",
      when: (answers) => !answers.useExistConfig || !answers.configFile,
    },
    {
      type: "password",
      name: "password",
      message: "请输入服务器密码：",
      when: (answers) => !answers.useExistConfig || !answers.configFile,
    },
    {
      type: "input",
      name: "port",
      message: "请输入服务器端口：",
      default: "22",
      when: (answers) => !answers.useExistConfig || !answers.configFile,
    },
    {
      type: "confirm",
      name: "saveConfig",
      message: "是否保存配置？",
      default: false,
      when: (answers) => !answers.useExistConfig || !answers.configFile,
    },
    {
      type: "input",
      name: "configName",
      message: "请输入配置文件名称",
      default: (answers: any) => `${answers.host}_${answers.username}`,
      when: (answers) => answers.saveConfig,
    },
  ]);

  // 只返回需要的数据
  if (answer.useExistConfig && answer.configFile) {
    // 使用已有的配置文件，并且选择了配置文件
    const configPath = join(
      process.cwd(),
      "config",
      `${answer.configFile}.yaml`
    );
    const config = parse(readFileSync(configPath, "utf-8"));
    return {
      ...config,
      password: decrypt(config.password),
    };
  } else {
    // 使用已有的配置文件，但是没有选择配置文件
    // 或者没有使用已有的配置文件
    // 对配置信息进行对称加密

    const config = {
      host: answer.host,
      username: answer.username,
      password: answer.password,
      port: answer.port,
    };
    if (answer.saveConfig) {
      // 保存配置
      const configPath = join(
        process.cwd(),
        "config",
        `${answer.configName}.yaml`
      );
      // 只加密密码
      writeFileSync(
        configPath,
        stringify({
          ...config,
          password: encrypt(config.password),
        })
      );
    }
    return config;
  }
};
