// 回滚问题
import inquirer from "inquirer";
import { NodeSSH } from "node-ssh";
import {
  confirmAndExecute,
  searchProjectFolders,
  searchZipFiles,
} from "../utils/ssh";
export const rollback = async (
  ssh: NodeSSH,
  projectFolder?: string
): Promise<{
  isRollback: boolean;
  projectFolder?: string;
}> => {
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
      when: (answers) => answers.rollback && !projectFolder,
    },
    {
      type: "list",
      name: "projectFolder",
      message: "请选择搜索到的项目路径：",
      choices: async (answers) => {
        return await searchProjectFolders(ssh, answers.searchProjectName);
      },
      when: (answers) => answers.rollback && !projectFolder,
    },
    {
      type: "list",
      name: "rollbackZipFile",
      message: "请选择需要回滚的版本文件",
      choices: async (answers) => {
        return await searchZipFiles(
          ssh,
          answers.projectFolder || projectFolder!
        );
      },
      when: (answers) => answers.rollback,
    },
  ]);
  if (answer.rollback) {
    // 操作各自执行
    await confirmAndExecute([{ ssh, projectFolder: projectFolder || answer.projectFolder }], "rollback", {
      zipFile: answer.rollbackZipFile,
      packagesPath: ''
    });
  }
  return {
    isRollback: answer.rollback,
    projectFolder: projectFolder || answer.projectFolder,
  };
};
