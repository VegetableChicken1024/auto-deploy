import inquirer from "inquirer";
const prompt = inquirer.createPromptModule();

export const askLocalFilePath = async (): Promise<string> => {
  const answers = await prompt([
    {
      type: "input",
      name: "localFilePath",
      message: "请输入本地文件路径",
      default: "./buildFiles",
    },
  ]);
  return answers.localFilePath;
};
