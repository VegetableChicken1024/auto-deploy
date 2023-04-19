import inquirer from "inquirer";
import { sshMap, findDirs } from "../utils";
const prompt = inquirer.createPromptModule();

// 目前自动搜索仅支持单配置
export const askRemotePath = async () => {
  // 获取第一个ssh实例
  const ssh = sshMap.values().next().value.ssh;
  const answers = await prompt([
    {
      type: "input",
      name: "remoteFolder",
      message: "请输入项目存放目录(支持自动搜索)",
      validate: (value) => {
        if (value) return true;
        return "目录不能为空";
      }
    },
    {
      type: "list",
      name: "remotePath",
      message: "请选择项目部署路径",
      choices: (answer) => {
        return findDirs(ssh, answer.remoteFolder);
      },
      when: (answer) => answer.remoteFolder,
    },
  ]);
  return answers.remotePath;
};
