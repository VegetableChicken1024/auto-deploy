import { defaultConfig } from "./config";
import { createSSH, getSSHConfig, searchProjectFolders } from "./ssh";
import { logger } from "./logger";
import { IConfig } from "../types";
import { QuestionCollection, Question } from "inquirer";
import { readdirSync } from "fs";
import { extname } from "path";

const createPrompt = (configKey: keyof IConfig, prompt: Question) => {
  return defaultConfig?.[configKey] ? [] : [prompt];
};

const exitWithMessage = (message: string, delay = 3000) => {
  console.log(message);
  logger.info(message);
  setTimeout(() => {
    process.exit(0);
  }, delay);
};
export const questions: QuestionCollection = [
  // 读取当前目录下默认配置 default.yaml
  // 如果内部的usename，password，host，port存在且有值，则不询问，否则询问
  ...createPrompt("host", {
    type: "input",
    name: "host",
    message: "请输入服务器地址：",
  }),
  ...createPrompt("username", {
    type: "input",
    name: "username",
    message: "请输入服务器用户名：",
  }),
  ...createPrompt("password", {
    type: "password",
    name: "password",
    message: "请输入服务器密码：",
  }),
  ...createPrompt("port", {
    type: "input",
    name: "port",
    message: "请输入服务器端口：",
    default: "22",
  }),
  // 保存配置
  {
    type: "confirm",
    name: "saveConfig",
    message: "是否保存配置？",
    default: false,
    when: (answers) =>
      answers.host && answers.username && answers.password && answers.port,
  },
  // 添加回滚询问
  {
    type: "confirm",
    name: "rollback",
    message: "是否回滚？",
    default: false,
  },

  {
    type: "input",
    name: "searchProjectName",
    message: "请输入当前部署的项目名进行路径搜索：",
    when: (answers) => answers.rollback,
  },
  {
    type: "list",
    name: "projectFolder",
    message: "请选择搜索到的项目路径：",
    choices: async function (answers) {
      const ssh = await createSSH(getSSHConfig(defaultConfig, answers));
      return await searchProjectFolders(ssh!, answers.searchProjectName);
    },
    when: (answers) => answers.rollback,
  },
  {
    type: "list",
    name: "rollbackZipFile",
    message: "请选择需要回滚的版本文件",
    choices: async function (answers) {
      const ssh = await createSSH(getSSHConfig(defaultConfig, answers));
      const selectedFolder = answers.projectFolder;
      const command = `find ${selectedFolder} -type f -name "*.zip"`;
      const { stdout } = (await ssh?.execCommand(command)) || {};
      logger.info("搜索到的历史版本：", stdout);
      ssh?.dispose();
      if (!stdout) {
        exitWithMessage(
          "未搜索到历史版本，请检查项目路径是否正确，程序将在3秒后退出"
        );
      }
      return stdout?.split("\n").filter((file) => file);
    },
    when: (answers) => answers.rollback,
  },

  {
    type: "list",
    name: "localZipFile",
    message: "请选择当前路径下的需要部署的文件",
    choices: async function () {
      const currentPath = process.cwd();
      const files = readdirSync(currentPath);
      const zipFiles = files.filter((file: any) => extname(file) === ".zip");
      if (!zipFiles.length) {
        exitWithMessage(
          "当前路径下未找到zip文件，请检查当前路径，程序将在3秒后退出"
        );
      }
      return zipFiles;
    },
    when: (answers) => !answers.rollback,
  },

  {
    type: "input",
    name: "projectName",
    message: "请输入当前部署的项目名进行路径搜索：",
    default: function (answers: any) {
      const zipFileName = answers.localZipFile;
      // eg: test_v1.0.0_20230303.zip
      const projectNameMatch = zipFileName.match(
        /^(.*?)(?:_v\d+\.\d+\.\d+_\d+)?\.zip$/
      );
      return projectNameMatch ? projectNameMatch[1] : "";
    },
    when: (answers) => !answers.rollback,
  },
  {
    type: "list",
    name: "projectFolder",
    message: "请选择搜索到的项目路径：",
    choices: async function (answers) {
      const ssh = await createSSH(getSSHConfig(defaultConfig, answers));
      return await searchProjectFolders(ssh!, answers.projectName);
    },
    when: (answers) => !answers.rollback,
  },
];
