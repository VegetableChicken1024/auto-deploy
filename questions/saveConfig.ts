import inquirer from "inquirer";
import { stringify } from "yaml";
import { encrypt } from "../utils/cryptoUtil";
import { writeFileSync } from "fs";
import { join } from "path";

export const saveConfig = async (config: {
  host: string;
  username: string;
  password: string;
  port: number;
  projectFolder?: string;
}) => {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "saveConfig",
      message: "是否保存配置？",
      default: false,
    },
    {
      type: "input",
      name: "configName",
      message: "请输入配置文件名称",
      default: (answers: any) =>
        `${config.host}_${config.projectFolder?.split("/").pop()}`,
      when: (answers) => answers.saveConfig,
    },
  ]);
  if (answer.saveConfig) {
    // 将配置文件保存到当前目录下的config文件夹
    // 默认配置需要有host、username、password、port、projectFolder
    if (!config.projectFolder) {
      console.log("项目路径不能为空");
      return;
    }
    // 保存配置
    const configPath = join(process.cwd(), "config");
    const configName = `${answer.configName}.yaml`;
    const configContent = stringify({
      ...config,
      password: encrypt(config.password),
    });
    writeFileSync(join(configPath, configName), configContent);
  }
};
