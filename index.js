// D:\Project\Custom\deploy\index.mjs
const inquirer = require('inquirer');
const { createSSH, getSSHConfig, confirmAndExecute } = require('./utils/ssh.js');
const questions = require('./utils/questions.js');
const { defaultConfig, saveConfig } = require('./utils/config.js');
// 询问用户服务器信息
console.log('欢迎使用自动部署工具');
// 使用提示
console.log('使用提示：');
// 编写使用提示
console.log('1. 请确保您已正确配置服务器信息（可以根据提示编写，也可使用现有的配置文件<default.yaml>）');
console.log('2. 选择部署或回滚操作');
console.log('3. 请正确填写项目名称，一般为压缩包版本号前的字符，如 blog-client_v1.0.0_20230303 中的 blog-client')
console.log('4. 填写项目名称后，将自动在服务器中查询对应项目的文件目录，可能存在多个，请正确选择');
console.log('5. 确认信息无误后，将自动完成部署或回滚');
console.log('6. 操作完成后，程序将自动退出');

console.log('待做事项：');
console.log('1. 增加多个配置自由选择');
console.log('2. 增加服务端项目自动打包部署功能');
console.log('3. 优化日志输出');
console.log('4. 增加开发人员项目自动打包压缩功能');
console.log('5. 增加前端项目自动开启浏览器预览功能');
console.log('6. 增加webpack打包混淆,tree shaking功能');
console.log('7. 增加nginx配置文件自动更新功能');
console.log('8. 增加服务器自动创建项目文件夹功能');
console.log('9. 新增本地压缩包路径填写功能');
console.log('10. 增加本地配置文件路径填写功能');

const main = async () => {
  const answers = await inquirer.prompt(questions)
  const ssh = await createSSH(getSSHConfig(defaultConfig, answers));
  console.log('连接成功');
  console.log('服务器地址', defaultConfig?.host || answers.host);
  console.log('服务器端口', defaultConfig?.port || answers.port);
  console.log('服务器用户名', defaultConfig?.username || answers.username);
  console.log('项目部署路径', answers.projectFolder);
  if (answers.saveConfig) {
    saveConfig({
      host: answers.host,
      port: answers.port,
      username: answers.username,
      password: answers.password
    })
  }
  if (answers.rollback) {
    // 回滚
    await confirmAndExecute(ssh, 'rollback', answers)
  } else {
    // 部署
    await confirmAndExecute(ssh, 'deploy', answers)
  }
  setTimeout(() => {
    process.exit(0);
  }, 3000);
}

main()
