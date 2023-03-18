// 部署问题
import inquirer from "inquirer";
import { IConfig } from "../types";
import { readdirSync } from "fs";
import { resolve } from "path";
import {
  confirmAndExecute,
  createSSH,
  searchProjectFolders,
} from "../utils/ssh";
const searchZipFiles = () => {
  // 读取/packages目录下的zip文件
  const packagesPath = resolve(process.cwd(), "packages");
  const zipFiles = readdirSync(packagesPath).filter((file) =>
    file.endsWith(".zip")
  );
  if (zipFiles.length === 0) {
    console.log("packages目录下没有zip文件，请与开发人员确认");
    return [];
  }
  return zipFiles;
};
export const deploy = async (config: IConfig) => {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "deploy",
      message: "是否部署？",
      default: false,
    },
    {
      type: "list",
      name: "localZipFile",
      message: "请选择需要部署的版本文件",
      choices: () => searchZipFiles(),
      when: (answers) => answers.deploy && searchZipFiles().length > 0,
    },
    {
      type: "input",
      name: "searchProjectName",
      message: "请输入当前部署的项目名进行路径搜索：",
      when: (answers) => answers.deploy && answers.localZipFile,
      default: (answers: any) => {
        const projectNameMatch = answers.localZipFile.match(
          /^(.*?)(?:_v\d+\.\d+\.\d+_\d+)?\.zip$/
        );
        return projectNameMatch ? projectNameMatch[1] : "";
      },
    },
    {
      type: "list",
      name: "projectFolder",
      message: "请选择搜索到的项目路径：",
      choices: async (answers) => {
        const ssh = await createSSH(config);
        return await searchProjectFolders(ssh!, answers.searchProjectName);
      },
      when: (answers) =>
        answers.deploy && answers.localZipFile && answers.searchProjectName,
    },
  ]);
  if (answer.deploy) {
    const ssh = await createSSH(config);
    console.log("服务器地址", config.host);
    console.log("服务器端口", config.port);
    console.log("服务器用户名", config.username);
    console.log("项目部署路径", answer.projectFolder);
    await confirmAndExecute(ssh!, "deploy", answer);
  }
  return answer.deploy;
};
