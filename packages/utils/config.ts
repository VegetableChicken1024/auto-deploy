import { join } from 'path'
import { readFileSync, existsSync } from 'fs'
import { parse } from 'yaml'
import { IConfig } from '../types/config'
import { IDeployrc } from '../types/deployrc'

// 保存配置信息
export const configMap = new Map<string, IConfig>()

/**
 * 获取deployrc配置
 * @returns {Object} deployrc配置
 */
export const getDeployrc = (): IDeployrc => {
    // 获取.deployrc.json配置
    const deployecPath = join(process.cwd(), '.deployrc.json')
    // 判断是否存在.deployrc.json配置
    existsSync(deployecPath) || (() => { throw new Error('请在项目根目录下创建.deployrc.json配置文件') })()
    const deployrc = JSON.parse(readFileSync(deployecPath, 'utf-8'))
    return deployrc
}

/**
 * 获取配置文件内容
 * @param optionPath 配置文件路径
 * @returns {Object} 配置文件内容
 */
export const getOption = (optionPath: string): IConfig => {
    const path = join(process.cwd(), optionPath)
    // 判断path是否存在
    existsSync(path) || (() => { throw new Error(`当前配置文件不存在，请在相关目录进行创建`) })()
    const file = readFileSync(path, 'utf-8')
    const option = parse(file)
    // 保存配置信息
    configMap.set(option.host, option)
    return option
}