import inquirer from "inquirer";
import { findZips, sshMap } from "../utils";
const prompt = inquirer.createPromptModule();

export const askRemoteFileName = async (
  remotePath: string
): Promise<string> => {
  // 获取第一个ssh实例
  const ssh = sshMap.values().next().value.ssh;
  const answers = await prompt([
    {
      type: "list",
      name: "remoteFileName",
      choices: async () => {
        const zips = await findZips(ssh, remotePath);
        // 截取掉前面的remotePath
        return zips.map((zip) => zip.slice(remotePath.length + 1));
      },
    },
  ]);
  return answers.remoteFileName;
};
