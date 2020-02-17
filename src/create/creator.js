import path from 'path';
import fs from 'fs-extra';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';

export default class Creator {
    constructor() {
        const store = memFs.create();
        this.fs = editor.create(store);
        this.init();
    }

    // 初始化的相关内容
    init() { }
    
    // 获取模版的路径
    templatePath(name) {
        const cwd = process.cwd()
        const filepath = path.join(cwd, name);
        return filepath;
    }

    // 获取根目录的路径
    getRootPath() {
        return path.resolve(__dirname, '../');
    }
    
    // 将对应的模版替换到工程的位置 参数为Array
    // 每个Array的item中的参数需要有from, to, data
    template(list) {
        list.forEach(item => {
            const { from, to, data } = item

            const fromPath = this.templatePath(from)
            const toPath = this.templatePath(to)

            if (!fs.existsSync(fromPath)) {
                console.log(chalk.red(`${fromPath}模板路径不存在`))
            } else {
                // 替换对应的文件中的模版语法
                this.fs.copyTpl(fromPath, toPath, data)
            }
        })

        return this
    }

    // 复制对应的模版到工程中去，当是js/vue/html时是复制文件，其他的是创建文件
    copyTemplate(from, to) {
        const rootPath = this.getRootPath()
        const fromPath = path.join(rootPath, from)
        const toPath = this.templatePath(to)

        if (!fs.existsSync(toPath)) {
            if (/\.(js|vue|html)$/.test(toPath)) {
                fs.writeFileSync(toPath)
            } else {
                fs.mkdirSync(toPath);
            }
        }
        
        this.fs.copy(fromPath, toPath)
    }

    // 项目/框架初始化时保留一些空文件，批量新增gitkeep
    writeGitKeepFile(dirname) {
        dirname = path.resolve(dirname);
        fs.writeFileSync(path.join(dirname, '.gitkeep'), 'Place hold file', 'utf8');
    }
    
    write() { }
}
