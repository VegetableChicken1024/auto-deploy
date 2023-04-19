import inquirer from "inquirer"
import { getOption } from "../utils"
import { IConfig } from "../types/config"
const prompt = inquirer.createPromptModule()

export const askConfig = async (configPaths: string[]): Promise<IConfig[]> => {
    const answers = await prompt([
        {
            type: 'checkbox',
            name: 'configs',
            message: '请选择需要部署的配置文件',
            choices: () => {
                return configPaths.map(item => ({
                    name: item.slice(item.lastIndexOf('/') + 1),
                    value: item
                }))
            },
            validate: (value) => {
                if (value.length) return true
                return '配置文件不能为空'
            }
        }
    ])
    const options: IConfig[] = answers.configs.map((item: string) => getOption(item))
    return options
}
