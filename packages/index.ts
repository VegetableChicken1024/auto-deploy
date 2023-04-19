import {
  getDeployrc,
  createSSHConnection,
  closeAllSSHConnection,
  sshMap,
  deploy,
  rollback,
} from "./utils";
import {
  askConfig,
  askDeployOrRollback,
  askRemotePath,
  askLocalFilePath,
  askLocalZipPath,
  askRemoteFileName,
} from "./questions";

const deployrc = getDeployrc();

const main = async () => {
  // 询问配置
  const configs = await askConfig(deployrc.configPaths);
  // 创建ssh连接
  await Promise.allSettled(configs.map((item) => createSSHConnection(item)));
  // 询问部署或回滚
  const deployOrRollback = await askDeployOrRollback();
  // 询问远程路径仅支持单配置
  const remotePath =
    sshMap.size === 1 && !deployrc.remotePath
      ? await askRemotePath()
      : deployrc.remotePath;

  if (deployOrRollback === "rollback") {
    if (sshMap.size > 1) {
      console.log("回滚仅支持单配置");
      return;
    }
    // 询问远程文件名
    const remoteFileName = await askRemoteFileName(remotePath);
    // 回滚
    await rollback(
      sshMap.values().next().value.ssh,
      remotePath,
      remoteFileName
    );
  } else {
    // 询问本地文件路径
    const localFilePath = deployrc.localFilePath || (await askLocalFilePath());
    // 询问本地zip包路径
    const { fileName, filePath } = await askLocalZipPath(localFilePath);
    await Promise.allSettled(
      configs.map((item) => {
        const ssh = sshMap.get(item.host)?.ssh;
        if (ssh) return deploy(ssh, remotePath, filePath, fileName);
      })
    );
  }
  closeAllSSHConnection();
};

main();
