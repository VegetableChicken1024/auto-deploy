!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["auto-deploy"]=t():e["auto-deploy"]=t()}(global,(()=>(()=>{"use strict";var e={692:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=o(964),a=o(99),r=(0,i.getDeployrc)();try{n(void 0,void 0,void 0,(function*(){const e=!(r.configPaths.length>0)||(yield(0,a.askUseNewConfig)()),t=r.configPaths.length>0&&!e?1===r.configPaths.length?[(0,i.getOption)(r.configPaths[0])]:yield(0,a.askConfig)(r.configPaths):[yield(0,a.askNewConfig)()];yield Promise.allSettled(t.map((e=>(0,i.createSSHConnection)(e))));const o=yield(0,a.askDeployOrRollback)(),n=1!==i.sshMap.size||r.remotePath?r.remotePath:yield(0,a.askRemotePath)(),c=r.remoteBakPath||(yield(0,a.askRemoteBakPath)());if("rollback"===o){if(i.sshMap.size>1)return void console.log("回滚仅支持单配置");const e=yield(0,a.askRemoteFileName)(c);yield(0,i.rollback)(i.sshMap.values().next().value.ssh,c,n,e)}else{const e=r.localFilePath||(yield(0,a.askLocalFilePath)());r.buildCommand&&(yield(0,i.build)(r.buildCommand));const o=(new Date).toLocaleDateString().replace(/\//g,"-"),s=`${r.zipPrefix}_${o}.zip`;r.buildPath&&(yield(0,i.buildZip)(s,e,r.buildPath));const{fileName:l,filePath:u}=yield(0,a.askLocalZipPath)(e);yield Promise.allSettled(t.map((e=>{var t;const o=null===(t=i.sshMap.get(e.host))||void 0===t?void 0:t.ssh;if(o)return(0,i.deploy)(o,c,n,u,l)})))}(0,i.closeAllSSHConnection)()}))}catch(e){(0,i.closeAllSSHConnection)()}},998:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askConfig=void 0;const a=i(o(290)),r=o(964),c=a.default.createPromptModule();t.askConfig=e=>n(void 0,void 0,void 0,(function*(){return(yield c([{type:"checkbox",name:"configs",message:"请选择需要部署的配置文件",choices:()=>e.map((e=>({name:e.slice(e.lastIndexOf("/")+1),value:e}))),validate:e=>!!e.length||"配置文件不能为空"}])).configs.map((e=>(0,r.getOption)(e)))}))},236:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askDeployOrRollback=void 0;const a=i(o(290)).default.createPromptModule();t.askDeployOrRollback=()=>n(void 0,void 0,void 0,(function*(){return(yield a([{type:"list",name:"deployOrRollback",message:"请选择操作",choices:[{name:"部署",value:"deploy"},{name:"回滚",value:"rollback"}]}])).deployOrRollback}))},99:function(e,t,o){var n=this&&this.__createBinding||(Object.create?function(e,t,o,n){void 0===n&&(n=o);var i=Object.getOwnPropertyDescriptor(t,o);i&&!("get"in i?!t.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return t[o]}}),Object.defineProperty(e,n,i)}:function(e,t,o,n){void 0===n&&(n=o),e[n]=t[o]}),i=this&&this.__exportStar||function(e,t){for(var o in e)"default"===o||Object.prototype.hasOwnProperty.call(t,o)||n(t,e,o)};Object.defineProperty(t,"__esModule",{value:!0}),i(o(998),t),i(o(236),t),i(o(619),t),i(o(974),t),i(o(763),t),i(o(554),t),i(o(86),t),i(o(838),t),i(o(258),t)},974:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askLocalFilePath=void 0;const a=i(o(290)),r=o(147),c=a.default.createPromptModule();t.askLocalFilePath=()=>n(void 0,void 0,void 0,(function*(){return(yield c([{type:"input",name:"localFilePath",message:"请输入本地文件路径",default:"./buildFiles",validate:e=>!!(0,r.existsSync)(e)||"文件路径不存在"}])).localFilePath}))},763:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askLocalZipPath=void 0;const a=i(o(290)),r=o(17),c=o(147),s=a.default.createPromptModule();t.askLocalZipPath=e=>n(void 0,void 0,void 0,(function*(){const t=yield s([{type:"list",name:"localZipPath",choices:()=>(e=>{const t=(0,r.resolve)(process.cwd(),e);if(!(0,c.existsSync)(t))throw new Error("文件夹不存在");return(0,c.readdirSync)(t).filter((e=>e.endsWith(".zip"))).map((e=>({name:e,value:{fileName:e,filePath:(0,r.resolve)(t,e)}})))})(e),message:"请选择要上传的zip包",validate:e=>!!e||"请选择要上传的zip包"}]);return t.localZipPath}))},86:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askNewConfig=void 0;const a=i(o(290)),r=o(964),c=a.default.createPromptModule();t.askNewConfig=()=>n(void 0,void 0,void 0,(function*(){const e=yield c([{type:"input",name:"host",message:"请输入服务器host",validate:e=>!!e||"请输入服务器host"},{type:"input",name:"username",message:"请输入服务器用户名",validate:e=>!!e||"请输入服务器用户名"},{type:"password",name:"password",message:"请输入服务器密码",validate:e=>!!e||"请输入服务器密码"},{type:"input",name:"port",message:"请输入服务器端口",default:22,validate:e=>!!e||"请输入服务器端口"},{type:"confirm",name:"isSave",message:"是否保存配置",default:!0},{type:"input",name:"savePath",message:"请输入配置保存路径",default:"./configs",when:e=>e.isSave}]),t={host:e.host,username:e.username,password:e.password,port:e.port},{isSave:o}=e;return o&&(0,r.saveOption)(e.savePath,t),t}))},258:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askRemoteBakPath=void 0;const a=i(o(290)),r=o(964),c=a.default.createPromptModule();t.askRemoteBakPath=()=>n(void 0,void 0,void 0,(function*(){const e=yield c([{type:"input",name:"remoteBakPath",message:"请输入远程备份路径",validate:e=>!!e||"请输入远程备份路径"}]);return(0,r.saveDeployrc)("remoteBakPath",e.remoteBakPath),e.remoteBakPath}))},554:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askRemoteFileName=void 0;const a=i(o(290)),r=o(964),c=a.default.createPromptModule();t.askRemoteFileName=e=>n(void 0,void 0,void 0,(function*(){const t=r.sshMap.values().next().value.ssh;return(yield c([{type:"list",name:"remoteFileName",choices:()=>n(void 0,void 0,void 0,(function*(){return(yield(0,r.findZips)(t,e)).map((t=>t.slice(e.length+1)))}))}])).remoteFileName}))},619:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askRemotePath=void 0;const a=i(o(290)),r=o(964),c=a.default.createPromptModule();t.askRemotePath=()=>n(void 0,void 0,void 0,(function*(){const e=r.sshMap.values().next().value.ssh;return(yield c([{type:"input",name:"remoteFolder",message:"请输入项目存放目录(支持自动搜索)",validate:e=>!!e||"目录不能为空"},{type:"list",name:"remotePath",message:"请选择项目部署路径",choices:t=>(0,r.findDirs)(e,t.remoteFolder),when:e=>e.remoteFolder}])).remotePath}))},838:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.askUseNewConfig=void 0;const a=i(o(290)).default.createPromptModule();t.askUseNewConfig=()=>n(void 0,void 0,void 0,(function*(){return(yield a([{type:"confirm",name:"useNewConfig",message:"是否使用新的配置",default:!1}])).useNewConfig}))},678:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.buildZip=t.build=void 0;const a=i(o(844)),r=i(o(81)),c=o(17),s=o(147);t.build=e=>n(void 0,void 0,void 0,(function*(){return console.log("正在执行构建命令，请稍候..."),new Promise(((t,o)=>{r.default.exec(e,((e,n,i)=>{e?(console.log("构建失败"),console.log(e),o(e)):(console.log("构建成功"),t())}))}))})),t.buildZip=(e,t,o)=>n(void 0,void 0,void 0,(function*(){console.log("正在打包zip文件，请稍候...");const n=new a.default;return new Promise(((i,a)=>{o.forEach((e=>{const t=(0,c.join)(process.cwd(),e);(0,s.statSync)(t).isDirectory()?n.addLocalFolder(t,e):n.addLocalFile(t,e)})),n.writeZip((0,c.join)(t,e),(e=>{e?(console.log("打包zip文件失败"),console.log(e),a(e)):(console.log("打包zip文件成功"),i())}))}))}))},620:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.saveDeployrc=t.saveOption=t.getOption=t.getDeployrc=t.configMap=void 0;const n=o(17),i=o(147),a=o(66);t.configMap=new Map,t.getDeployrc=()=>{const e=(0,n.join)(process.cwd(),".deployrc.json");return(0,i.existsSync)(e)||(()=>{throw new Error("请在项目根目录下创建.deployrc.json配置文件")})(),JSON.parse((0,i.readFileSync)(e,"utf-8"))},t.getOption=e=>{const o=(0,n.join)(process.cwd(),e);(0,i.existsSync)(o)||(()=>{throw new Error("当前配置文件不存在，请在相关目录进行创建")})();const r=(0,i.readFileSync)(o,"utf-8"),c=(0,a.parse)(r);return t.configMap.set(c.host,c),c},t.saveOption=(e,o)=>{const r=(0,n.join)(process.cwd(),e);(0,i.existsSync)(r)||(0,i.mkdirSync)(r,{recursive:!0}),(0,i.writeFileSync)(`${r}/${o.host}.yaml`,(0,a.stringify)(o)),(0,t.saveDeployrc)("configPaths",`${e}/${o.host}.yaml`)},t.saveDeployrc=(e,o)=>{const a=(0,t.getDeployrc)();"configPaths"===e||"buildPath"===e?a[e].push(o):a[e]=o,(0,i.writeFileSync)((0,n.join)(process.cwd(),".deployrc.json"),JSON.stringify(a,null,2))}},964:function(e,t,o){var n=this&&this.__createBinding||(Object.create?function(e,t,o,n){void 0===n&&(n=o);var i=Object.getOwnPropertyDescriptor(t,o);i&&!("get"in i?!t.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return t[o]}}),Object.defineProperty(e,n,i)}:function(e,t,o,n){void 0===n&&(n=o),e[n]=t[o]}),i=this&&this.__exportStar||function(e,t){for(var o in e)"default"===o||Object.prototype.hasOwnProperty.call(t,o)||n(t,e,o)};Object.defineProperty(t,"__esModule",{value:!0}),i(o(620),t),i(o(454),t),i(o(678),t)},454:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,a){function r(e){try{s(n.next(e))}catch(e){a(e)}}function c(e){try{s(n.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.findZips=t.rollback=t.deploy=t.unzip=t.uploadZip=t.findDirs=t.closeAllSSHConnection=t.closeSSHConnection=t.createSSHConnection=t.sshMap=void 0;const i=o(374),a=o(620),r=["host","port","username","password"];t.sshMap=new Map,t.createSSHConnection=e=>n(void 0,void 0,void 0,(function*(){const o=new i.NodeSSH,n=Object.keys(e).reduce(((t,o)=>(r.includes(o)&&(t[o]=e[o]),t)),{});yield o.connect(n).then((()=>{t.sshMap.set(e.host,{ssh:o})})).catch((t=>{console.log(`${n.host}连接失败：${t}`),a.configMap.delete(e.host)}))})),t.closeSSHConnection=e=>{var o;const n=null===(o=t.sshMap.get(e))||void 0===o?void 0:o.ssh;n&&(n.dispose(),t.sshMap.delete(e))},t.closeAllSSHConnection=()=>{t.sshMap.forEach(((e,o)=>{(0,t.closeSSHConnection)(o)})),t.sshMap.clear()},t.findDirs=(e,t)=>n(void 0,void 0,void 0,(function*(){console.log("正在搜索项目文件夹，请稍候...");const o=`find / -type d -name "*${t}*" -exec test -e {}/index.html \\; -print 2>/dev/null`,{stdout:n}=yield e.execCommand(o);return n?n.split("\n").filter((e=>e)):[]})),t.uploadZip=(e,t,o)=>n(void 0,void 0,void 0,(function*(){console.log("正在上传文件，请稍候..."),yield e.putFile(t,o)})),t.unzip=(e,t,o,i)=>n(void 0,void 0,void 0,(function*(){console.log("正在解压文件，请稍候...");const n=`unzip -o ${t+"/"+i} -d ${o}`;yield e.execCommand(n)})),t.deploy=(e,o,i,a,r)=>n(void 0,void 0,void 0,(function*(){console.log("正在部署项目，请稍候..."),yield(0,t.uploadZip)(e,a,o+"/"+r),yield(0,t.unzip)(e,o,i,r)})),t.rollback=(e,o,i,a)=>n(void 0,void 0,void 0,(function*(){console.log("正在回滚项目，请稍候..."),yield(0,t.unzip)(e,o,i,a)})),t.findZips=(e,t)=>n(void 0,void 0,void 0,(function*(){console.log("正在搜索项目文件夹，请稍候...");const o=`find ${t} -name "*.zip"`,{stdout:n}=yield e.execCommand(o);return n?n.split("\n").filter((e=>e)):[]}))},844:e=>{e.exports=require("adm-zip")},290:e=>{e.exports=require("inquirer")},374:e=>{e.exports=require("node-ssh")},66:e=>{e.exports=require("yaml")},81:e=>{e.exports=require("child_process")},147:e=>{e.exports=require("fs")},17:e=>{e.exports=require("path")}},t={},o=function o(n){var i=t[n];if(void 0!==i)return i.exports;var a=t[n]={exports:{}};return e[n].call(a.exports,a,a.exports,o),a.exports}(692);return o.default})()));