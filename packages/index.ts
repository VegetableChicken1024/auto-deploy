import {
  getDeployrc,
  createSSHConnection,
  closeAllSSHConnection,
  sshMap,
  deploy,
  rollback,
  build,
  buildZip,
  getOption,
} from "./utils";
import {
  askConfig,
  askDeployOrRollback,
  askRemotePath,
  askLocalFilePath,
  askLocalZipPath,
  askRemoteFileName,
  askNewConfig,
  askUseNewConfig,
  askRemoteBakPath,
} from "./questions";

const deployrc = getDeployrc();

const main = async () => {
  // 询问是否使用新配置
  const useNewConfig =
    deployrc.configPaths.length > 0 ? await askUseNewConfig() : true;
  // 询问配置
  const configs =
    deployrc.configPaths.length > 0 && !useNewConfig
      ? deployrc.configPaths.length === 1
        ? [getOption(deployrc.configPaths[0])]
        : await askConfig(deployrc.configPaths)
      : [await askNewConfig()];
  // 创建ssh连接
  await Promise.allSettled(configs.map((item) => createSSHConnection(item)));
  // 询问部署或回滚
  const deployOrRollback = await askDeployOrRollback();
  // 询问远程路径仅支持单配置
  const remotePath =
    sshMap.size === 1 && !deployrc.remotePath
      ? await askRemotePath()
      : deployrc.remotePath;
  // 询问备份路径
  const remoteBakPath = deployrc.remoteBakPath || (await askRemoteBakPath());
  if (deployOrRollback === "rollback") {
    if (sshMap.size > 1) {
      console.log("回滚仅支持单配置");
      return;
    }
    // 询问远程文件名
    const remoteFileName = await askRemoteFileName(remoteBakPath);
    // 回滚
    await rollback(
      sshMap.values().next().value.ssh,
      remoteBakPath,
      remotePath,
      remoteFileName,
      deployrc.remoteCommands
    );
  } else {
    // 询问本地文件路径
    const localFilePath = deployrc.localFilePath || (await askLocalFilePath());
    // 询问本地zip包路径
    deployrc.buildCommand && (await build(deployrc.buildCommand));
    // 获取时间2022-01-01
    const date = new Date().toLocaleDateString().replace(/\//g, "-");
    const zipName = `${deployrc.zipPrefix}_${date}.zip`;
    deployrc.buildPath &&
      (await buildZip(zipName, localFilePath, deployrc.buildPath));
    const { fileName, filePath } = await askLocalZipPath(localFilePath);
    await Promise.allSettled(
      configs.map((item) => {
        const ssh = sshMap.get(item.host)?.ssh;
        if (ssh)
          return deploy(
            ssh,
            remoteBakPath,
            remotePath,
            filePath,
            fileName,
            deployrc.remoteCommands
          );
      })
    );
  }
  closeAllSSHConnection();
};

try {
  main();
} catch (error) {
  closeAllSSHConnection();
}
