import inquirer from "inquirer";
const prompt = inquirer.createPromptModule();

export const askDeployOrRollback = async (): Promise<"deploy" | "rollback"> => {
  const answers = await prompt([
    {
      type: "list",
      name: "deployOrRollback",
      message: "请选择操作",
      choices: [
        { name: "部署", value: "deploy" },
        { name: "回滚", value: "rollback" },
      ],
    },
  ]);
  return answers.deployOrRollback;
};
