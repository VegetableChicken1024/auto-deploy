import inquirer from "inquirer";
import { resolve } from "path";
import { readdirSync, existsSync } from "fs";
const prompt = inquirer.createPromptModule();

const findFiles = (folderPath: string) => {
  // 查找目标文件夹下所有的.zip文件
  const targetPath = resolve(process.cwd(), folderPath);
  if (!existsSync(targetPath)) {
    throw new Error("文件夹不存在");
  }
  const files = readdirSync(targetPath);
  return files
    .filter((file) => file.endsWith(".zip"))
    .map((file) => ({
      name: file,
      value: { fileName: file, filePath: resolve(targetPath, file) },
    }));
};

export const askLocalZipPath = async (
  folderPath: string
): Promise<{ fileName: string; filePath: string }> => {
  const answer = await prompt([
    {
      type: "list",
      name: "localZipPath",
      choices: () => {
        return findFiles(folderPath);
      },
      message: "请选择要上传的zip包",
      validate: (input: string) => {
        if (!input) {
          return "请选择要上传的zip包";
        }
        return true;
      },
    },
  ]);
  return answer.localZipPath;
};
