// ssh配置相关
import inquirer from "inquirer";
import { IConfig } from "../types";

export const getSshConfig = async (): Promise<
  Array<Omit<IConfig, "projectFolder">>
> => {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "host",
      message: "请输入服务器地址：",
      when: (answers) => !answers.useExistConfig,
    },
    {
      type: "input",
      name: "username",
      message: "请输入服务器用户名：",
      when: (answers) => !answers.useExistConfig,
    },
    {
      type: "password",
      name: "password",
      message: "请输入服务器密码：",
      when: (answers) => !answers.useExistConfig,
    },
    {
      type: "input",
      name: "port",
      message: "请输入服务器端口：",
      default: "22",
      when: (answers) => !answers.useExistConfig,
    },
  ]);

  const config = {
    host: answer.host,
    username: answer.username,
    password: answer.password,
    port: answer.port,
  };
  return [config];
};
