import { getSshConfig } from "./questions/sshConfig";
import { rollback } from "./questions/rollback";
import { deploy } from "./questions/deploy";
import { getDefault } from "./questions/default";
import { getConfig } from "./utils/config";
import { createSSH } from "./utils/ssh";
import { saveConfig } from "./questions/saveConfig";
// 询问用户服务器信息
console.log("欢迎使用自动部署工具");
// 使用提示
console.log("使用提示：");
// 编写使用提示
console.log(
  "1. 请确保您已正确配置服务器信息（可以根据提示编写，也可使用现有的配置文件）"
);
console.log("2. 选择部署或回滚操作");
console.log(
  "3. 请正确填写项目名称，一般为压缩包版本号前的字符，如 blog-client_v1.0.0_20230303 中的 blog-client"
);
console.log(
  "4. 填写项目名称后，将自动在服务器中查询对应项目的文件目录，可能存在多个，请正确选择"
);
console.log("5. 确认信息无误后，将自动完成部署或回滚");
console.log("6. 操作完成后，程序将自动退出");

// console.log("待做事项：");
// console.log("1. 增加多个配置自由选择 [已完成]");
// console.log("2. 增加服务端项目自动打包部署功能");
// console.log("3. 优化日志输出");
// console.log("4. 增加开发人员项目自动打包压缩功能");
// console.log("5. 增加前端项目自动开启浏览器预览功能");
// console.log("6. 新增ts支持，新增webpack打包支持 [已完成]");
// console.log("7. 增加nginx配置文件自动更新功能");
// console.log("8. 增加服务器自动创建项目文件夹功能");
// console.log("9. 新增本地压缩包路径填写功能");
// console.log("10. 增加本地配置文件路径填写功能");
// console.log("11. 增加配置信息加密 [已完成]");
const main = async () => {
  // 判断是否使用默认配置
  const { useExistConfig, configFile } = await getDefault();
  // 获取配置信息
  const config = useExistConfig && configFile ? getConfig(configFile) : null;
  // 如果config为空，说明没有配置文件，需要询问用户服务器信息
  const sshConfig = config || (await getSshConfig());
  const ssh = await createSSH(sshConfig);
  // 询问用户是否回滚
  const rollbackOptions = await rollback(ssh!, config?.projectFolder);
  // 询问用户是否部署
  const deployOptions = !rollbackOptions.isRollback
    ? await deploy(ssh!, config?.projectFolder)
    : { isDeploy: false };
  // 如果没有选择任何操作，提示用户并退出程序
  if (!rollbackOptions.isRollback && !deployOptions.isDeploy) {
    console.log("未选择任何操作，程序将在3秒后退出");
    setTimeout(() => {
      process.exit(0);
    }, 3000);
    ssh?.dispose();
    return;
  }
  // 询问是否保存配置
  (!useExistConfig || !configFile) &&
    (await saveConfig({
      ...sshConfig, // 服务器信息
      projectFolder:
        rollbackOptions.projectFolder ?? deployOptions.projectFolder, // 项目文件夹
    }));
  console.log("操作完成，程序将在3秒后退出");
  setTimeout(() => {
    process.exit(0);
  }, 3000);
  ssh?.dispose();
};
main();