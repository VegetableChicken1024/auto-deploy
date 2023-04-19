export interface IDeployrc {
  configPaths: string[];
  remotePath: string;
  localFilePath: string;
  buildCommand: string;
  buildPath: string;
  zipPrefix: string;
}
