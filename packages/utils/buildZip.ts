import AdmZip from "adm-zip";
import child_process from "child_process";
import { join } from "path";
import { statSync } from "fs";
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
