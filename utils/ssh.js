const { NodeSSH } = require('node-ssh');
const inquirer = require('inquirer');
const logger = require('./logger');
const path = require('path');
const createSSH = async (config) => {
    try {
        const ssh = new NodeSSH();
        await ssh.connect(config);
        return ssh;
    } catch (error) {
        console.log('创建SSH连接出现错误：', error)
        logger.error('创建SSH连接出现错误：', error)
    }
}

const searchProjectFolders = async (ssh, projectName) => {
    try {
        console.log('正在搜索项目文件夹，请稍候...');
        logger.info('正在搜索项目文件夹，请稍候...', projectName);
        const command = `find / -type d -name "*${projectName}*" -exec test -e {}/index.html \\; -print 2>/dev/null`;
        const { stdout } = await ssh.execCommand(command);
        logger.info('搜索到的项目文件夹：', stdout);
        if (!stdout) {
            console.log('未搜索到项目文件夹，请检查输入的项目名是否正确，程序将在3秒后退出');
            logger.info('未搜索到项目文件夹，请检查输入的项目名是否正确，程序将在3秒后退出');
            setTimeout(() => {
                process.exit(0);
            }, 3000);
        }
        return stdout.split('\n').filter(folder => folder);
    } catch (error) {
        console.log('搜索项目文件夹出现错误：', error)
        logger.error('搜索项目文件夹出现错误：', error)
    } finally {
        ssh.dispose();
    }

}


const getSSHConfig = (defaultConfig, answers) => {
    return {
        host: defaultConfig?.host || answers.host,
        username: defaultConfig?.username || answers.username,
        password: defaultConfig?.password || answers.password,
        port: defaultConfig?.port || answers.port,
    };
}

const confirmAndExecute = async (ssh, action, answers) => {
    try {
        const actionName = action === 'rollback' ? '回滚' : '部署';
        const zipFile = action === 'rollback' ? answers.rollbackZipFile : answers.localZipFile;
        const projectFolder = answers.projectFolder;
        console.log(`${actionName}版本`, zipFile)
        logger.info(`${actionName}版本`, zipFile)
        const confirmPrompt = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmAction',
                message: `确认信息无误，开始${actionName}？`,
                default: false,
            },
        ]);
        if (confirmPrompt.confirmAction) {
            console.log(`开始${actionName}`)
            logger.info(`开始${actionName}`)
            if (action === 'deploy') {
                await ssh.putFile(path.resolve(process.cwd(), zipFile), `${projectFolder}/${zipFile}`);
            }
            const unzipCommand = `unzip -o ${zipFile} -d ${projectFolder}`;
            await ssh.execCommand(unzipCommand);
            console.log(`${actionName}成功，请手动刷新浏览器，程序将在3秒后退出`)
            logger.info(`${actionName}成功，请手动刷新浏览器，程序将在3秒后退出`)
        } else {
            console.log(`${actionName}已取消`)
            logger.info(`${actionName}已取消`)
        }
    } catch (error) {
        console.log('执行操作出现错误：', error)
        logger.error('执行操作出现错误：', error)
    } finally {
        ssh.dispose();
    }

}

module.exports = {
    createSSH,
    searchProjectFolders,
    getSSHConfig,
    confirmAndExecute
}