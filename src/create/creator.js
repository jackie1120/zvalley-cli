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
    
    template(from, to, data) {
        const fromPath = this.templatePath(from)
        const toPath = this.templatePath(to)

        if (!fs.existsSync(fromPath)) {
            console.log(chalk.red('模板路径不存在'))
            return
        }

        this.fs.copyTpl(fromPath, toPath, data)
        // this.fs.commit(() => {})
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
