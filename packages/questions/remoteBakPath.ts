import inquirer from "inquirer";
import { saveDeployrc } from "../utils";
const prompt = inquirer.createPromptModule();

export const askRemoteBakPath = async (): Promise<string> => {
  const answers = await prompt([
    {
      type: "input",
      name: "remoteBakPath",
      message: "请输入远程备份路径",
      validate: (input: string) => {
        if (!input) return "请输入远程备份路径";
        return true;
      },
    },
  ]);
  saveDeployrc("remoteBakPath", answers.remoteBakPath);
  return answers.remoteBakPath;
};
