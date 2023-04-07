import AdmZip from "adm-zip";
export const zipFiles = (folder: string, zipName: string) => {
    console.log("开始压缩, 压缩文件夹路径：", folder, "压缩文件存放路径：", zipName);
    const zip = new AdmZip();
    return new Promise((resolve, reject) => {
        zip.addLocalFolder(folder);
        zip.writeZip(zipName, (err) => {
            if (err) {
                console.log("压缩失败");
                reject(err);
            } else {
                console.log("压缩完成");
                resolve(zipName);
            }
        });
    })
}