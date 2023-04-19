import { NodeSSH } from "node-ssh";
import { IConfig } from "../types/config";
import { configMap } from "./config";
const optionKeys = ["host", "port", "username", "password"];
// 保存ssh连接实例
export const sshMap = new Map<string, { ssh: NodeSSH }>();

/**
 * 创建ssh连接
 * @param option ssh配置
 * @returns ssh实例
 */
export const createSSHConnection = async (option: IConfig) => {
  const ssh = new NodeSSH();
  const sshOption = Object.keys(option).reduce((prev, key) => {
    if (optionKeys.includes(key)) prev[key] = option[key];
    return prev;
  }, {} as IConfig);
  await ssh
    .connect(sshOption)
    .then(() => {
      sshMap.set(option.host, { ssh });
    })
    .catch((err) => {
      console.log(`${sshOption.host}连接失败：${err}`);
      configMap.delete(option.host);
    });
};

/**
 * 关闭ssh连接
 * @param host ssh连接host
 * @returns void
 */
export const closeSSHConnection = (host: string) => {
  const ssh = sshMap.get(host)?.ssh;
  if (ssh) {
    ssh.dispose();
    sshMap.delete(host);
  }
};

/**
 * 关闭所有ssh连接
 * @returns void
 */
export const closeAllSSHConnection = () => {
  sshMap.forEach((_value, key) => {
    closeSSHConnection(key);
  });
  sshMap.clear();
};

/**
 * 根据传入的文件夹名，寻找对应的文件夹
 * @param {NodeSSH} ssh ssh实例
 * @param {string} dirName 文件夹名
 * @returns {Array} 文件夹路径
 */
export const findDirs = async (
  ssh: NodeSSH,
  dirName: string
): Promise<string[]> => {
  console.log("正在搜索项目文件夹，请稍候...");
  const command = `find / -type d -name "*${dirName}*" -exec test -e {}/index.html \\; -print 2>/dev/null`;
  const { stdout } = await ssh.execCommand(command);
  if (!stdout) return [];
  return stdout.split("\n").filter((folder) => folder);
};

/**
 * 将本地文件压缩包上传到服务器
 * @param {NodeSSH} ssh ssh实例
 * @param {string} localZipPath 本地文件压缩包路径
 * @param {string} remotePath 服务器文件压缩包路径
 * @returns {void}
 */
export const uploadZip = async (
  ssh: NodeSSH,
  localZipPath: string,
  remotePath: string
): Promise<void> => {
  console.log("正在上传文件，请稍候...");
  await ssh.putFile(localZipPath, remotePath);
};

/**
 * 远程解压文件
 * @param {NodeSSH} ssh ssh实例
 * @param {string} remotePath 远程文件压缩包路径
 * @param {string} fileName 文件名
 * @returns {void}
 */
export const unzip = async (
  ssh: NodeSSH,
  remotePath: string,
  fileName: string
): Promise<void> => {
  console.log("正在解压文件，请稍候...");
  const command = `unzip -o ${remotePath + "/" + fileName} -d ${remotePath}`;
  await ssh.execCommand(command);
};

/**
 * 部署项目
 * @param {NodeSSH} ssh ssh实例
 * @param {string} remotePath 远程文件压缩包路径
 * @param {string} localFilePath 本地文件路径
 * @param {string} fileName 文件名
 * @returns {void}
 */
export const deploy = async (
  ssh: NodeSSH,
  remotePath: string,
  localFilePath: string,
  fileName: string
): Promise<void> => {
  console.log("正在部署项目，请稍候...");
  // 上传文件
  await uploadZip(ssh, localFilePath, remotePath);
  // 解压文件
  await unzip(ssh, remotePath, fileName);
};

/**
 * 回滚项目
 * @param {NodeSSH} ssh ssh实例
 * @param {string} remotePath 远程文件压缩包路径
 * @param {string} fileName 文件名
 * @returns {void}
 */
export const rollback = async (
  ssh: NodeSSH,
  remotePath: string,
  fileName: string
): Promise<void> => {
  console.log("正在回滚项目，请稍候...");
  // 解压文件
  await unzip(ssh, remotePath, fileName);
};

/**
 * 根据传入的文件夹名，寻找该文件夹下所有的zip文件
 * @param {NodeSSH} ssh ssh实例
 * @param {string} dirName 文件夹名
 * @returns {Array} zip文件路径
 */
export const findZips = async (
  ssh: NodeSSH,
  dirName: string
): Promise<string[]> => {
  console.log("正在搜索项目文件夹，请稍候...");
  const command = `find ${dirName} -name "*.zip"`;
  const { stdout } = await ssh.execCommand(command);
  if (!stdout) return [];
  return stdout.split("\n").filter((folder) => folder);
};
