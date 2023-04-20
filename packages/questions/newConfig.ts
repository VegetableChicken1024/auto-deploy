import inquirer from "inquirer";
import { IConfig } from "../types/config";
import { saveOption } from "../utils";
const prompt = inquirer.createPromptModule();
export const askNewConfig = async (): Promise<IConfig> => {
  const answers = await prompt([
    {
      type: "input",
      name: "host",
      message: "请输入服务器host",
      validate: (input: string) => {
        if (!input) return "请输入服务器host";
        return true;
      },
    },
    {
      type: "input",
      name: "username",
      message: "请输入服务器用户名",
      validate: (input: string) => {
        if (!input) return "请输入服务器用户名";
        return true;
      },
    },
    {
      type: "password",
      name: "password",
      message: "请输入服务器密码",
      validate: (input: string) => {
        if (!input) return "请输入服务器密码";
        return true;
      },
    },
    {
      type: "input",
      name: "port",
      message: "请输入服务器端口",
      default: 22,
      validate: (input: string) => {
        if (!input) return "请输入服务器端口";
        return true;
      },
    },
    {
      type: "confirm",
      name: "isSave",
      message: "是否保存配置",
      default: true,
    },
    {
      type: "input",
      name: "savePath",
      message: "请输入配置保存路径",
      default: "./configs",
      when: (answers: any) => answers.isSave,
    },
  ]);
  const config: IConfig = {
    host: answers.host,
    username: answers.username,
    password: answers.password,
    port: answers.port,
  };
  const { isSave } = answers;
  if (isSave) {
    saveOption(answers.savePath, config);
  }
  return config;
};
