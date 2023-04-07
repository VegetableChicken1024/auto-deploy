#!/usr/bin/env node
import { getSshConfig } from "./questions/sshConfig";
import { rollback } from "./questions/rollback";
import { deploy } from "./questions/deploy";
import { getDefault } from "./questions/default";
import { getConfig, getOptionsCongfig } from "./utils/config";
import { createSSH } from "./utils/ssh";
import { saveConfig } from "./questions/saveConfig";
import { readFileSync } from "fs";
import { join } from "path";
import { exec } from './utils/build';
import { zipFiles } from './utils/zip';
import { getZipFileName } from "./questions/zip";

// // 询问用户服务器信息
// console.log("欢迎使用自动部署工具");
// // 使用提示
// console.log("使用提示：");
// // 编写使用提示
// console.log(
//     "1. 请确保您已正确配置服务器信息（可以根据提示编写，也可使用现有的配置文件）"
// );
// console.log("2. 选择部署或回滚操作");
// console.log(
//     "3. 请正确填写项目名称，一般为压缩包版本号前的字符，如 blog-client_v1.0.0_20230303 中的 blog-client"
// );
// console.log(
//     "4. 填写项目名称后，将自动在服务器中查询对应项目的文件目录，可能存在多个，请正确选择"
// );
// console.log("5. 确认信息无误后，将自动完成部署或回滚");
// console.log("6. 操作完成后，程序将自动退出");

// // console.log("待做事项：");
// // console.log("1. 增加多个配置自由选择 [已完成]");
// // console.log("2. 增加服务端项目自动打包部署功能");
// // console.log("3. 优化日志输出");
// // console.log("4. 增加开发人员项目自动打包压缩功能");
// // console.log("5. 增加前端项目自动开启浏览器预览功能");
// // console.log("6. 新增ts支持，新增webpack打包支持 [已完成]");
// // console.log("7. 增加nginx配置文件自动更新功能");
// // console.log("8. 增加服务器自动创建项目文件夹功能");
// // console.log("9. 新增本地压缩包路径填写功能");
// // console.log("10. 增加本地配置文件路径填写功能");
// // console.log("11. 增加配置信息加密 [已完成]");

// 读取deployrc.json

interface IDeployrcConfig {
    configPaths: string[];
    buildCommand?: string;
    compressionFolder?: string;
    archiveFolder?: string;
}
const deployrcPath = join(process.cwd(), "deployrc.json");
const deployrc: IDeployrcConfig = JSON.parse(readFileSync(deployrcPath, "utf-8"));
deployrc.buildCommand && exec(deployrc.buildCommand).then(async () => {
    if (deployrc.compressionFolder) {
        const zipName = await getZipFileName();
        await zipFiles(deployrc.compressionFolder, join(process.cwd(), deployrc.archiveFolder ?? '', zipName + '.zip'));
        main()
    }
});
const main = async () => {
    // 判断是否使用默认配置
    const { configFiles } = await getDefault(deployrc.configPaths);
    // 获取配置信息
    const configs = configFiles ? getOptionsCongfig(configFiles) : null;
    // 如果config为空，说明没有配置文件，需要询问用户服务器信息
    const sshConfigs = configs || (await getSshConfig());
    // 创建ssh连接
    const sshs = await Promise.all(sshConfigs.map(async sshConfig => ({
        ssh: await createSSH(sshConfig),
        projectFolder: 'projectFolder' in sshConfig ? sshConfig.projectFolder as string : undefined,
    })))
    // 多配置的情况暂时不支持回滚
    // 询问用户是否回滚
    if (sshs.length > 1) {
        console.log("多个配置暂不支持回滚");
    }
    const rollbackOptions = sshs.length > 1 ? { isRollback: false } : await rollback(sshs[0].ssh!, sshs[0].projectFolder);
    // 询问用户是否部署
    const deployOptions = !rollbackOptions.isRollback ?
        await deploy(sshs as any, deployrc.archiveFolder!) : { isDeploy: false };
    // // 如果没有选择任何操作，提示用户并退出程序
    if (!rollbackOptions.isRollback && !deployOptions.isDeploy) {
        console.log("未选择任何操作，程序将在3秒后退出");
        setTimeout(() => {
            process.exit(0);
        }, 3000);
        sshs.forEach(ssh => ssh.ssh?.dispose());
        return;
    }
    // 询问是否保存配置
    // (!useExistConfig || !configFile) &&
    //     (await saveConfig({
    //         ...sshConfig, // 服务器信息
    //         projectFolder:
    //             rollbackOptions.projectFolder ?? deployOptions.projectFolder, // 项目文件夹
    //     }));
    // ssh?.dispose();
};

// main();
