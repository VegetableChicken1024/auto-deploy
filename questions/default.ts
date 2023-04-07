import inquirer from "inquirer";
import { join, extname } from "path";
import { existsSync, mkdirSync, readdirSync } from "fs";

// 查找./config目录下的所有配置文件
const searchConfigFiles = () => {
  const configPath = join(process.cwd(), "config");
  if (!existsSync(configPath)) {
    mkdirSync(configPath);
  }
  const files = readdirSync(configPath);
  if (files.length === 0) {
    console.log("当前目录下没有配置文件，请根据后续提示创建配置");
    return [];
  } else {
    return files
      .filter((file) => extname(file) === ".yaml")
      .map((file) => file.replace(".yaml", ""));
  }
};

export const getDefault = async (optionsConfigPaths?: string[]): Promise<{
  useExistConfig: boolean;
  configFiles: string[];
}> => {
  console.log(optionsConfigPaths)
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'configFiles',
      message: '请选择配置文件',
      when: () => optionsConfigPaths && optionsConfigPaths.length > 0,
      choices: () => {
        const paths = optionsConfigPaths?.map((path, index) => ({
          name: path.split('/').pop()?.replace('.yaml', '') || '',
          value: path,
        }))
        return paths
      },
    },
    {
      type: "confirm",
      name: "useExistConfig",
      message: "是否使用已有的配置文件？",
      default: true,
      when: () => !optionsConfigPaths || optionsConfigPaths.length === 0,
    },
    {
      type: "list",
      name: "configFiles",
      message: "请选择配置文件",
      choices: () => searchConfigFiles(),
      when: (answers) => {
        const length = searchConfigFiles().length;
        return answers.useExistConfig && length > 0 && (!optionsConfigPaths || optionsConfigPaths.length === 0);
      },
    },
  ]);
  return answers;
};
