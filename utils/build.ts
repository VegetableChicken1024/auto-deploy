import { exec as ChildExec, ExecOptions } from "child_process";

export const exec = (command: string, options?: ExecOptions) => {
    return new Promise((resolve, reject) => {
        console.log('开始打包，请稍候，命令：', command, '参数：', options || '无')
        ChildExec(command, options, (err, stdout, stderr) => {
            if (err) {
                console.log('打包失败')
                reject(err);
            } else {
                console.log('打包完成')
                resolve(stdout);
            }
        });
    });
}