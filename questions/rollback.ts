// 回滚问题
import inquirer from "inquirer";
import { IConfig } from "../types";
import {
  createSSH,
  searchProjectFolders,
  searchZipFiles,
  confirmAndExecute,
} from "../utils/ssh";
export const rollback = async (sshConfig: IConfig) => {
  const answer = await inquirer.prompt([
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
      choices: async (answers) => {
        const ssh = await createSSH(sshConfig);
        return await searchProjectFolders(ssh!, answers.searchProjectName);
      },
      when: (answers) => answers.rollback,
    },
    {
      type: "list",
      name: "rollbackZipFile",
      message: "请选择需要回滚的版本文件",
      choices: async (answers) => {
        const ssh = await createSSH(sshConfig);
        return await searchZipFiles(ssh!, answers.projectFolder);
      },
      when: (answers) => answers.rollback,
    },
  ]);
  if (answer.rollback) {
    console.log("服务器地址", sshConfig.host);
    console.log("服务器端口", sshConfig.port);
    console.log("服务器用户名", sshConfig.username);
    console.log("项目部署路径", answer.projectFolder);
    const ssh = await createSSH(sshConfig);
    await confirmAndExecute(ssh!, "rollback", answer);
  }
  return answer.rollback;
};
