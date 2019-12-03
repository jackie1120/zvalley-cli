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
    init() { }
    
    templatePath(name) {
        const cwd = process.cwd()
        const filepath = path.join(cwd, name);
        return filepath;
    }

    getRootPath() {
        return path.resolve(__dirname, '../');
    }
    
    template(list) {
        list.forEach(item => {
            const { from, to, data } = item

            const fromPath = this.templatePath(from)
            const toPath = this.templatePath(to)

            if (!fs.existsSync(fromPath)) {
                console.log(chalk.red(`${fromPath}模板路径不存在`))
            } else {
                this.fs.copyTpl(fromPath, toPath, data)
            }
        })

        return this
    }

    copyTemplate(from, to) {
        const rootPath = this.getRootPath()
        const fromPath = path.join(rootPath, from)
        const toPath = this.templatePath(to)
        fs.mkdirSync(toPath);
        this.fs.copy(fromPath, toPath)
    }

    writeGitKeepFile(dirname) {
        dirname = path.resolve(dirname);
        fs.writeFileSync(path.join(dirname, '.gitkeep'), 'Place hold file', 'utf8');
    }
    write() { }
}
