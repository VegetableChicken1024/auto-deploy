import inquirer from "inquirer";
import { readFileSync, writeFileSync } from 'fs'

export const getZipFileName = async () => {
    // 获取当前日期 20220202
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const dateStr = `${year}${month}${day}`;
    // 读取package.json文件
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const version = packageJson.version;
    const name = packageJson.name.replace(/\//g, '_');
    // version最后一位加1
    const versionArr = version.split('.');
    const last = versionArr.pop();
    versionArr.push((parseInt(last) + 1).toString());
    const newVersion = versionArr.join('.');
    const defaultZipFileName = `${name}_${newVersion}_${dateStr}.zip`;
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "zipFileName",
            message: "请输入压缩文件名：",
            default: defaultZipFileName
        },
    ]);
    // 将新的version写入package.json
    if (answer.zipFileName === defaultZipFileName) {
        packageJson.version = newVersion;
        writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    }
    // 文件名可能存在斜杠，导致压缩的时候路径不正确，需要替换掉
    const zipFileName = answer.zipFileName.replace(/\//g, '_');
    return zipFileName;
}