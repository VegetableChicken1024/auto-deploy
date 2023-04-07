// 部署问题
import inquirer from "inquirer";
import { readdirSync } from "fs";
import { resolve } from "path";
import { confirmAndExecute, searchProjectFolders } from "../utils/ssh";
import { NodeSSH } from "node-ssh";
const searchZipFiles = (packagePath: string) => {
  // 读取/packages目录下的zip文件
  const packagesPath = resolve(process.cwd(), packagePath);
  const zipFiles = readdirSync(packagesPath).filter((file) =>
    file.endsWith(".zip")
  );
  if (zipFiles.length === 0) {
    console.log(`${packagePath}目录下没有zip文件，请与开发人员确认`);
    return [];
  }
  return zipFiles;
};
export const deploy = async (
  sshs: Array<{
    ssh: NodeSSH;
    projectFolder: string;
  }>,
  packagePath: string
): Promise<{
  isDeploy: boolean;
  projectFolder?: string;
}> => {
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
      choices: () => searchZipFiles(packagePath),
      when: (answers) => answers.deploy && searchZipFiles(packagePath).length > 0,
    },
    // 配置大于1个ssh时，暂不支持搜索项目路径
    {
      type: "input",
      name: "searchProjectName",
      message: "请输入当前部署的项目名进行路径搜索：",
      when: (answers) =>
        answers.deploy && answers.localZipFile && sshs.every(ssh => !ssh.projectFolder) && sshs.length < 2,
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
        return await searchProjectFolders(sshs[0].ssh, answers.searchProjectName);
      },
      when: (answers) =>
        answers.deploy &&
        answers.localZipFile &&
        answers.searchProjectName &&
        sshs.every(ssh => !ssh.projectFolder) && sshs.length < 2,
    },
  ]);
  if (answer.deploy) {
    confirmAndExecute(sshs, "deploy", {
      zipFile: answer.localZipFile,
      packagesPath: packagePath,
    });
  }
  return {
    isDeploy: answer.deploy,
  };
};
