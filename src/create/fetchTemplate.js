var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import  ora from 'ora';
import download from 'download-git-repo';

// 下载远程的项目模版函数
export default function fetchTemplate(templateSource, templatePath, clone = false) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // 下载文件的缓存目录
        if (fs.existsSync(templatePath))
            yield fs.remove(templatePath);
        yield fs.mkdir(templatePath);
        const spinner = ora(`正在从 ${templateSource} 拉取远程模板...`).start();
        
        if (clone) {
            download(templateSource, templatePath, {
                clone: true
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    spinner.color = 'red';
                    spinner.fail(chalk.red('拉取远程模板仓库失败！'));
                    yield fs.remove(templatePath);
                    resolve();
                }
                spinner.color = 'green';
                spinner.succeed(`${chalk.grey('拉取远程模板仓库成功！')}`);
                resolve();
            }));
        } else {
            download(templateSource, templatePath, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    spinner.color = 'red';
                    spinner.fail(chalk.red('拉取远程模板仓库失败！'));
                    yield fs.remove(templatePath);
                    resolve();
                }
                spinner.color = 'green';
                spinner.succeed(`${chalk.grey('拉取远程模板仓库成功！')}`);
                resolve();
            }));
        }
    }))
}
