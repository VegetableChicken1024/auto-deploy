export interface IDeployrc {
  configPaths: string[]; // 配置文件路径
  remotePath: string; // 远程路径
  buildCommand: string; // 构建命令
  buildPath: string[]; // 构建后的文件路径
  zipPrefix: string; // zip文件前缀
  remoteBakPath: string; // 远程备份路径
  remoteCommands: string[]; // 远程命令
}
