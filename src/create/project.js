import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';
import semver from 'semver';
import fetchTemplate from './fetchTemplate';
import Creator from './creator';
import createApp from './init'
export default class Project extends Creator {
    constructor(options) {
        super(options.sourceRoot);
        this.askProjectName = function (conf, prompts) {
            if (typeof conf.projectName !== 'string') {
                prompts.push({
                    type: 'input',
                    name: 'projectName',
                    message: '请输入项目名称！',
                    validate(input) {
                        if (!input) {
                            return '项目名不能为空！';
                        }
                        if (fs.existsSync(input)) {
                            return '当前目录已经存在同名项目，请换一个项目名！';
                        }
                        return true;
                    }
                });
            }
            else if (fs.existsSync(conf.projectName)) {
                prompts.push({
                    type: 'input',
                    name: 'projectName',
                    message: '当前目录已经存在同名项目，请换一个项目名！',
                    validate(input) {
                        if (!input) {
                            return '项目名不能为空！';
                        }
                        if (fs.existsSync(input)) {
                            return '项目名依然重复！';
                        }
                        return true;
                    }
                });
            }
        };
        this.askDescription = function (conf, prompts) {
            if (typeof conf.description !== 'string') {
                prompts.push({
                    type: 'input',
                    name: 'description',
                    message: '请输入项目介绍！'
                });
            }
        };
        this.askTemplate = function (conf, prompts) {
            const choices = [{
                    name: '默认模板',
                    value: 'default'
                },{
                    name: '移动端',
                    value: '移动端'
                },{
                    name: '移动端-门户开发',
                    value: '移动端-门户开发'
                },{
                    name: 'PC端',
                    value: 'PC端'
                },{
                    name: '多页应用',
                    value: '多页应用'
                }];
            if (typeof conf.template !== 'string') {
                prompts.push({
                    type: 'list',
                    name: 'template',
                    message: '请选择模板',
                    choices
                });
            }
        };
        this.askInstall = function (conf, prompts) {
            prompts.push({
            type: 'confirm',
            name: 'autoInstall',
            message: '是否自动安装项目依赖包 ？'
            })
        };
        this.askPush = function (conf, prompts) {
            prompts.push({
            type: 'confirm',
            name: 'gitPush',
            message: '是否上传至远程Git仓库 ？'
            })
        };
        this.askGitAddress = function (prompts) {
            prompts.push({
                type: 'input',
                name: 'gitAddress',
                message: '请输入远程仓库地址！',
                validate(input) {
                    if (!input) {
                        return '仓库地址不能为空！';
                    }
                    if (!/^http:/.test(input) && !/^https:/.test(input)) {
                        return '仓库地址必须以https或者http开头！'
                    }
                    return true;
                }
            })
        };
        this.askLang = function (prompts) {
            prompts.push({
            type: 'confirm',
            name: 'lang',
            message: '是否添加国际化包 ？'
            })
        };
          
        const unSupportedVer = semver.lt(process.version, 'v7.6.0');
        if (unSupportedVer) {
            throw new Error('Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+');
        }

        this.conf = Object.assign({
            projectName: '',
            projectDir: '',
            template: '',
            description: '',
            gitAddress: '',
            lang: false
        }, options);
    }

    init() {
        console.log(chalk.green(`zvalley-cli即将创建一个新项目!`));
        console.log('Need help? Go and open issue: https://github.com/122687220/web-template/issues/new');
        console.log();
    }

    create() {
        // createApp(new Creator(), this.conf)
        this.ask()
            .then(answers => {
                const date = new Date();
                this.conf = Object.assign(this.conf, answers);
                if (this.conf.gitPush) {
                    this.askNext(this.conf).then(answers => {
                        this.conf = Object.assign(this.conf, answers);

                        this.conf.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
                        this.fetchTemplates(this.conf.template, this.conf.projectName)
                            .then(() => {
                                const from = `${this.conf.projectName}/package.json`
                                const creator = this.template(from, from, { name: this.conf.projectName, description: this.conf.description })

                                // const fromHTML = `${this.conf.projectName}/public/index.html`
                                // const creatorHTML = this.template(fromHTML, fromHTML, { title: this.conf.projectName })
                                // creatorHTML.fs.commit(() => {})
                                if (this.conf.lang) {
                                    this.copyTemplate('templates/lang', `${this.conf.projectName}/src/lang`)
                                }
                                createApp(creator, this.conf)
                            })
                            .catch(err => console.log(chalk.red('创建项目失败: ', err)));
                    })
                } else {
                    this.conf.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
                    this.fetchTemplates(this.conf.template, this.conf.projectName)
                        .then(() => {
                            const from = `${this.conf.projectName}/package.json`
                            const creator = this.template(from, from, { name: this.conf.projectName, description: this.conf.description })
                            createApp(creator, this.conf)
                        })
                        .catch(err => console.log(chalk.red('创建项目失败: ', err)));
                }
            })
            
    }

    fetchTemplates(template, projectName) {
        let url = `122687220/web-template#${encodeURI(template)}`
        if (template === 'default') {
            url = '122687220/web-template'
        }
        
        const filePath = this.templatePath(projectName)

        // 从模板源下载模板122687220/web-template
        return fetchTemplate(url, filePath);
    }

    ask() {
        const prompts = [];
        const conf = this.conf;
        this.askProjectName(conf, prompts);
        this.askDescription(conf, prompts);
        this.askTemplate(conf, prompts);
        this.askInstall(conf, prompts);
        this.askPush(conf, prompts);
        return inquirer.prompt(prompts);
    }
    askNext(conf) {
        const prompts = [];
        this.askGitAddress(prompts)
        if (conf.template === 'default' || conf.template === '移动端' ) {
            this.askLang(prompts)
        }
        return inquirer.prompt(prompts);
    }
}
