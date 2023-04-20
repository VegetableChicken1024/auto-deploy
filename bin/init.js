#!/usr/bin/env node

// 检查根目录下是否已经存在.deployrc.json
const fs = require("fs");
const path = require("path");
const deployrcPath = path.resolve(process.cwd(), ".deployrc.json");
if (!fs.existsSync(deployrcPath)) {
  // 创建.deployrc.json
  const content = {
    configPaths: [],
    remotePath: "",
    localFilePath: "",
    buildCommand: "",
    buildPath: [],
    remoteBakPath: "",
    remoteCommands: [],
  };
  fs.writeFileSync(deployrcPath, JSON.stringify(content, null, 2));
}
