import inquirer from "inquirer";
const prompt = inquirer.createPromptModule();

export const askUseNewConfig = async (): Promise<boolean> => {
  const answers = await prompt([
    {
      type: "confirm",
      name: "useNewConfig",
      message: "是否使用新的配置",
      default: false,
    },
  ]);
  return answers.useNewConfig;
};
