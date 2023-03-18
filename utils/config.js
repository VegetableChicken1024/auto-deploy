const path = require('path');
const fs = require('fs');
const yaml = require('yaml');
const defaultConfigPath = path.join(process.cwd(), 'default.yaml');
const configExists = fs.existsSync(defaultConfigPath);
const defaultConfig = configExists ? yaml.parse(fs.readFileSync(defaultConfigPath, 'utf8')) : {};

const saveConfig = (config) => {
    // 将配置写入default.yaml，如果没有这个文件就新建一个
    if (!configExists) {
        fs.writeFileSync(defaultConfigPath, '');
    }
    fs.writeFileSync(defaultConfigPath, yaml.stringify(config));
}

module.exports = {
    defaultConfig,
    saveConfig,
};