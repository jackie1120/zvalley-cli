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
        // 询问用户工程的名字
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
        // 询问用户工程的相关描述
        this.askDescription = function (conf, prompts) {
            if (typeof conf.description !== 'string') {
                prompts.push({
                    type: 'input',
                    name: 'description',
                    message: '请输入项目介绍！'
                });
            }
        };
        // 询问用户工程的模版
        // TODO: 这里需要修改
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
        // 询问用户是否需要自动安装依赖
        this.askInstall = function (conf, prompts) {
            prompts.push({
            type: 'confirm',
            name: 'autoInstall',
            message: '是否自动安装项目依赖包 ？'
            })
        };
        // 询问用户否上传至远程Git仓库
        this.askPush = function (conf, prompts) {
            prompts.push({
            type: 'confirm',
            name: 'gitPush',
            message: '是否上传至远程Git仓库 ？'
            })
        };
        // 询问用户远程Git仓库的地址
        this.askGitAddress = function (conf, prompts) {
            prompts.push({
                type: 'input',
                name: 'gitAddress',
                message: '请输入远程仓库地址！',
                validate(input) {
                    if (!input) {
                        return '仓库地址不能为空！';
                    }
                    if (!/^https?:/.test(input)) {
                        return '仓库地址必须以https或者http开头！';
                    }
                    return true;
                }
            })
        };
        // 询问用户是否添加国际化包
        this.askLang = function (conf, prompts) {
            prompts.push({
            type: 'confirm',
            name: 'lang',
            message: '是否添加国际化包 ？'
            })
        };
        // 询问用户是否添加是否添加换肤相关包
        this.askThemeReplace = function (conf, prompts) {
            prompts.push({
                type: 'confirm',
                name: 'themeReplace',
                message: '是否添加换肤相关包 ？'
            })
        };
        // 询问用户是否安装自己的UI库
        this.askInstallUI = function (template, prompts) {
            const message = template === 'default' ? '是否安装ZvUI__pc ？' : '是否安装ZvUI ？'
            prompts.push({
            type: 'confirm',
            name: 'installUI',
            message
            })
        };

        // 判断node的版本 版本过低的时候添加提示
        const unSupportedVer = semver.lt(process.version, 'v7.6.0');
        if (unSupportedVer) {
            throw new Error('Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+');
        }

        // 默认的配置项
        this.conf = Object.assign({
            projectName: '',
            projectDir: '',
            template: '',
            description: '',
            gitAddress: '',
            lang: false,
            themeReplace: false,
            installUI: false
        }, options);
    }

    // 初始化的控制台输出
    init() {
        console.log(chalk.green(`zvalley-cli即将创建一个新项目!`));
        console.log('Need help? Go and open issue: https://github.com/122687220/web-template/issues/new');
        console.log();
    }

    // 询问问题之后功能的实现
    // 模版的替换
    create() {
        this.ask()
            .then(answers => {
                this.conf = Object.assign(this.conf, answers);
                this.askNext(this.conf).then(answers => {
                    this.conf = Object.assign(this.conf, answers);
                    this.fetchTemplates(this.conf.template, this.conf.projectName)
                        .then(() => {
                            // copy国际化文件包
                            if (this.conf.lang) {
                                this.copyTemplate('templates/lang', `${this.conf.projectName}/src/lang`)
                            }
                            // copy主题色换肤文件包
                            if (this.conf.themeReplace) {
                                this.copyTemplate('templates/themeColorReplace', `${this.conf.projectName}/src/utils`)
                            }
                            // 组件库的添加 
                            // TODO: 可能需要删除内容
                            if (this.conf.installUI) {
                                if (this.conf.template === '移动端') {
                                    this.copyTemplate('templates/mobile/babel.config.js', `${this.conf.projectName}/babel.config.js`)
                                    this.copyTemplate('templates/mobile/zv-ui.js', `${this.conf.projectName}/src/plugins/zv-ui.js`)
                                } else if (this.conf.template === 'default') {
                                    this.copyTemplate('templates/pc/zv-ui__pc.js', `${this.conf.projectName}/src/plugins/zv-ui__pc.js`)
                                }
                            }

                            // 为各文件添加模板代码
                            let list = [
                                {
                                    from: `${this.conf.projectName}/package.json`,
                                    to: `${this.conf.projectName}/package.json`,
                                    data: { name: this.conf.projectName, description: this.conf.description, lang: this.conf.lang, installUI: this.conf.installUI }
                                }, {
                                    from: `${this.conf.projectName}/public/index.html`,
                                    to: `${this.conf.projectName}/public/index.html`,
                                    data: { title: this.conf.projectName }
                                }
                            ]

                            if (this.conf.template === 'default' || this.conf.template === '移动端' ) {
                                list = list.concat([
                                    {
                                        from: `${this.conf.projectName}/src/main.js`,
                                        to: `${this.conf.projectName}/src/main.js`,
                                        data: { lang: this.conf.lang }
                                    }, {
                                        from: `${this.conf.projectName}/src/views/Home.vue`,
                                        to: `${this.conf.projectName}/src/views/Home.vue`,
                                        data: { lang: this.conf.lang }
                                    }
                                ])
                            }
                            const creator = this.template(list)

                            createApp(creator, this.conf)
                        })
                        .catch(err => console.log(chalk.red('创建项目失败: ', err)));
                })
            })
    }

    // 模版的下载
    // TODO: 这个地方后续应该要修改 
    fetchTemplates(template, projectName) {
        let url = `122687220/web-template#${encodeURI(template)}`
        if (template === 'default') {
            url = '122687220/web-template'
        }
        
        const filePath = this.templatePath(projectName)

        // 从模板源下载模板122687220/web-template
        return fetchTemplate(url, filePath);
    }

    // 用户的所有问题的集合
    ask() {
        const prompts = [];
        const conf = this.conf;
        this.askProjectName(conf, prompts);
        this.askDescription(conf, prompts);
        this.askTemplate(conf, prompts);
        this.askThemeReplace(conf, prompts);
        this.askInstall(conf, prompts);
        this.askPush(conf, prompts);
        return inquirer.prompt(prompts);
    }
    // 询问完上面的内容之后需要继续询问的内容
    askNext(conf) {
        const prompts = [];
        if (conf.template === 'default' || conf.template === '移动端' ) {
            this.askLang(prompts)
            this.askInstallUI(conf.template, prompts)
        }
        if (conf.gitPush) {
            this.askGitAddress(prompts)
        }
        return inquirer.prompt(prompts);
    }
}
