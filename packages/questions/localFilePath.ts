import inquirer from "inquirer";
import { existsSync } from "fs";
const prompt = inquirer.createPromptModule();

export const askLocalFilePath = async (): Promise<string> => {
  const answers = await prompt([
    {
      type: "input",
      name: "localFilePath",
      message: "请输入本地文件路径",
      default: "./buildFiles",
      validate: (input: string) => {
        if (!existsSync(input)) {
          return "文件路径不存在";
        }
        return true;
      },
    },
  ]);
  return answers.localFilePath;
};
