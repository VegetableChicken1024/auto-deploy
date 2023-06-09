import AdmZip from "adm-zip";
import child_process from "child_process";
import { join } from "path";
import { statSync, existsSync, mkdirSync, rmSync } from "fs";
import { NodeSSH } from "node-ssh";
/**
 * 执行构建命令
 * @param {string} command 构建命令
 * @returns {void}
 */
export const build = async (command: string): Promise<void> => {
  console.log("正在执行构建命令，请稍候...");
  return new Promise((resolve, reject) => {
    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("构建失败");
        console.log(error);
        reject(error);
      } else {
        console.log("构建成功");
        resolve();
      }
    });
  });
};

/**
 * 打包zip文件
 * @param {string} zipName zip文件名
 * @param {string} zipPath zip文件路径
 * @param {string} distPath 构建后的文件路径
 * @returns {void}
 */
export const buildZip = async (
  zipName: string,
  zipPath: string,
  distPath: string[]
): Promise<void> => {
  console.log("正在打包zip文件，请稍候...");
  const zip = new AdmZip();
  return new Promise((resolve, reject) => {
    distPath.forEach((item) => {
      const distPath = join(process.cwd(), item);
      if (statSync(distPath).isDirectory()) {
        // 文件夹 判断item最后一位是否为/
        const needDir = item[item.length - 1] === "/";
        zip.addLocalFolder(distPath, needDir ? item : "");
      } else {
        // 文件
        zip.addLocalFile(distPath);
      }
    });
    existsSync(join(process.cwd(), zipPath)) ||
      mkdirSync(join(process.cwd(), zipPath));
    zip.writeZip(join(zipPath, zipName), (error) => {
      if (error) {
        console.log("打包zip文件失败");
        console.log(error);
        reject(error);
      } else {
        console.log("打包zip文件成功");
        resolve();
      }
    });
  });
};

/**
 * 计算文件名(本地)
 * @param {string} fileName 文件名
 * @param {string} zipPath zip文件路径
 * @returns {string} 文件名
 */
export const calculateFileNameLocal = (
  fileName: string,
  zipPath: string
): string => {
  const fileIsExist = existsSync(join(zipPath, fileName));
  if (fileIsExist) {
    const reg = /_\d+\.zip$/;
    const isExist = reg.test(fileName);
    if (isExist) {
      const num = Number(
        fileName.match(reg)?.[0].replace(/_/g, "").replace(/\.zip/g, "")
      );
      fileName = fileName.replace(reg, `_${num + 1}.zip`);
    } else {
      fileName = fileName.replace(/\.zip/g, "_1.zip");
    }
    return calculateFileNameLocal(fileName, zipPath);
  } else {
    return fileName;
  }
};

/**
 * 计算文件名(远程)
 * @param {NodeSSH} ssh ssh对象
 * @param {string} fileName 文件名
 * @param {string} zipPath zip文件路径
 * @returns {string} 文件名
 */
export const calculateFileNameRemote = async (
  ssh: NodeSSH,
  fileName: string,
  zipPath: string
): Promise<string> => {
  const { code } = await ssh.execCommand(`ls ${zipPath}/${fileName}`);
  if (code === 0) {
    const reg = /_\d+\.zip$/;
    const isExist = reg.test(fileName);
    if (isExist) {
      const num = Number(
        fileName.match(reg)?.[0].replace(/_/g, "").replace(/\.zip/g, "")
      );
      fileName = fileName.replace(reg, `_${num + 1}.zip`);
    } else {
      fileName = fileName.replace(/\.zip/g, "_1.zip");
    }
    return calculateFileNameRemote(ssh, fileName, zipPath);
  } else {
    return fileName;
  }
};

/**
 * 删除本地文件夹
 * @param {string} path 文件夹路径
 * @returns {void}
 */
export const deleteLocalFolder = (path: string): void => {
  const isExist = existsSync(path);
  if (isExist) {
    rmSync(path, { recursive: true });
  }
};

/**
 * 获取zip内文件夹或文件名(本地)
 * @param {string} zipPath zip文件路径
 * @param {string} zipName zip文件名
 * @returns {string[]} 文件夹或文件名
 */
export const getZipFolderOrFileNameLocal = (
  zipPath: string,
  zipName: string
): string[] => {
  console.log("正在获取zip内文件夹或文件名，请稍候...");
  // 只要zip内第一层文件夹或文件名
  const zip = new AdmZip(join(zipPath, zipName));
  const zipEntries = zip.getEntries();
  const folderOrFileName: string[] = [];
  zipEntries.forEach((item) => {
    const name = item.entryName.split("/")[0];
    if (!folderOrFileName.includes(name)) {
      folderOrFileName.push(name);
    }
  });
  return folderOrFileName;
};

/**
 * 获取zip内文件夹或文件名(远程)
 * @param {NodeSSH} ssh ssh对象
 * @param {string} zipPath zip文件路径
 * @param {string} zipName zip文件名
 * @returns {string[]} 文件夹或文件名
 */
export const getZipFolderOrFileNameRemote = async (
  ssh: NodeSSH,
  zipPath: string,
  zipName: string
): Promise<string[]> => {
  console.log("正在获取zip内文件夹或文件名，请稍候...");
  // 只要zip内第一层文件夹或文件名
  const command = `unzip -l ${zipPath}/${zipName} | awk '{print $4}' | sed '1d' | awk -F '/' '{print $1}' | uniq`;
  const { stdout } = await ssh.execCommand(command);
  return stdout
    .split("\n")
    .filter((item) => item !== "Name" && item !== "----");
};
