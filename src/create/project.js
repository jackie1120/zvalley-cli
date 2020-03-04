import fs from "fs-extra";
import chalk from "chalk";
import inquirer from "inquirer";
import semver from "semver";
import fetchTemplate from "./fetchTemplate";
import Creator from "./creator";
import createApp from "./init";
export default class Project extends Creator {
  constructor(options) {
    super(options.sourceRoot);
    // 询问用户工程的名字
    this.askProjectName = function(conf, prompts) {
      if (typeof conf.projectName !== "string") {
        prompts.push({
          type: "input",
          name: "projectName",
          message: "请输入项目名称！",
          validate(input) {
            if (!input) {
              return "项目名不能为空！";
            }
            if (fs.existsSync(input)) {
              return "当前目录已经存在同名项目，请换一个项目名！";
            }
            return true;
          }
        });
      } else if (fs.existsSync(conf.projectName)) {
        prompts.push({
          type: "input",
          name: "projectName",
          message: "当前目录已经存在同名项目，请换一个项目名！",
          validate(input) {
            if (!input) {
              return "项目名不能为空！";
            }
            if (fs.existsSync(input)) {
              return "项目名依然重复！";
            }
            return true;
          }
        });
      }
    };
    // 询问用户工程的相关描述
    this.askDescription = function(conf, prompts) {
      if (typeof conf.description !== "string") {
        prompts.push({
          type: "input",
          name: "description",
          message: "请输入项目介绍！"
        });
      }
    };
    // 询问用户工程的模版
    // 分为
    this.askTemplate = function(conf, prompts) {
      const choices = [
        {
          name: "PC端",
          value: "default"
        },
        {
          name: "H5",
          value: "H5"
        },
        {
          name: "混合开发",
          value: "Hybrid"
        },
        {
          name: "小程序开发uni-app",
          value: "mini-programme"
        },
        {
          name: "vue插件开发",
          value: "vue-plugin"
        }
      ];
      if (typeof conf.template !== "string") {
        prompts.push({
          type: "list",
          name: "template",
          message: "请选择模板",
          choices
        });
      }
    };
    // 询问用户是否需要自动安装依赖
    this.askInstall = function(conf, prompts) {
      prompts.push({
        type: "confirm",
        name: "autoInstall",
        message: "是否自动安装项目依赖包 ？"
      });
    };
    // 询问用户否上传至远程Git仓库
    this.askPush = function(conf, prompts) {
      prompts.push({
        type: "confirm",
        name: "gitPush",
        message: "是否上传至远程Git仓库 ？"
      });
    };
    // 询问用户远程Git仓库的地址
    this.askGitAddress = function(conf, prompts) {
      prompts.push({
        type: "input",
        name: "gitAddress",
        message: "请输入远程仓库地址！",
        validate(input) {
          if (!input) {
            return "仓库地址不能为空！";
          }
          if (!/^https?:/.test(input)) {
            return "仓库地址必须以https或者http开头！";
          }
          return true;
        }
      });
    };
    // 询问用户是否添加国际化包
    this.askLang = function(conf, prompts) {
      prompts.push({
        type: "confirm",
        name: "lang",
        message: "是否添加国际化包 ？"
      });
    };
    // 询问用户是否添加是否添加换肤相关包
    this.askThemeReplace = function(conf, prompts) {
      prompts.push({
        type: "confirm",
        name: "themeReplace",
        message: "是否添加换肤相关包 ？"
      });
    };
    // 询问用户是否安装自己的UI库
    this.askInstallUI = function(template, prompts) {
      const message =
        template === "default" ? "是否安装element-ui ？" : "是否安装vant-ui ？";
      prompts.push({
        type: "confirm",
        name: "installUI",
        message
      });
    };

    // 判断node的版本 版本过低的时候添加提示
    const unSupportedVer = semver.lt(process.version, "v7.6.0");
    if (unSupportedVer) {
      throw new Error("Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+");
    }

    // 默认的配置项
    this.conf = Object.assign(
      {
        projectName: "",
        projectDir: "",
        template: "",
        description: "",
        gitAddress: "",
        lang: false,
        themeReplace: false,
        autoInstall: false,
        installUI: false
      },
      options
    );
  }

  // 初始化的控制台输出
  init() {
    console.log(chalk.green(`zvalley-cli即将创建一个新项目!`));
    console.log(
      "Need help? Go and open issue: https://github.com/122687220/web-template/issues/new"
    );
    console.log();
  }

  // 询问问题之后功能的实现
  // 模版的替换
  create() {
    this.ask().then(answers => {
      this.conf = Object.assign(this.conf, answers);
      this.askImportModule().then(answers => {
        this.conf = Object.assign(this.conf, answers);
        this.askNext(this.conf).then(answers => {
          this.conf = Object.assign(this.conf, answers);
          this.fetchTemplates(this.conf.template, this.conf.projectName)
            .then(() => {
              if (['mini-programme', 'vue-plugin'].includes(this.conf.template)) {
                createApp(this, this.conf);
                return
              }
              // 判断是否是手机环境的 
              const isMobile = this.conf.template !== 'default'
              // 判断是否是混合开发环境
              const isHybrid = isMobile && this.conf.template === 'Hybrid'
              // copy国际化文件包
              if (this.conf.lang) {
                this.copyTemplate(
                  "templates/lang",
                  `${this.conf.projectName}/src/lang`
                );
              }
              // copy主题色换肤文件包
              if (this.conf.themeReplace) {
                this.copyTemplate(
                  "templates/themeColorReplace",
                  `${this.conf.projectName}/src/utils`
                );
              }

              // 注入手机上的一些兼用性解决方案
              if (isMobile) {
                this.copyTemplate(
                  "templates/mobile/solution.js",
                  `${this.conf.projectName}/src/utils/solution.js`
                );
              }

              // 注入原生包
              if (isHybrid) {
                this.copyTemplate(
                  "templates/hybrid",
                  `${this.conf.projectName}/src/utils`
                );
              }

              // 组件库的添加 手机端添加 vant-ui / pc安装 element-ui
              if (this.conf.installUI) {
                if (this.conf.template !== "default") {
                  this.copyTemplate(
                    "templates/mobile/babel.config.js",
                    `${this.conf.projectName}/babel.config.js`
                  );
                  this.copyTemplate(
                    "templates/mobile/vant_ui.js",
                    `${this.conf.projectName}/src/plugins/vant-ui.js`
                  );
                } else {
                  this.copyTemplate(
                    "templates/pc/babel.config.js",
                    `${this.conf.projectName}/babel.config.js`
                  );
                  this.copyTemplate(
                    "templates/pc/element_ui.js",
                    `${this.conf.projectName}/src/plugins/element_ui.js`
                  );
                }
              }

              // 为各文件添加模板代码
              let list = [
                {
                  from: `${this.conf.projectName}/package.json`,
                  to: `${this.conf.projectName}/package.json`,
                  data: {
                    isMobile,
                    isHybrid,
                    name: this.conf.projectName,
                    description: this.conf.description,
                    themeReplace: this.conf.themeReplace,
                    lang: this.conf.lang,
                    installUI: this.conf.installUI
                  }
                },
                {
                  from: `${this.conf.projectName}/public/index.html`,
                  to: `${this.conf.projectName}/public/index.html`,
                  data: { title: this.conf.projectName }
                },
                {
                  from: `${this.conf.projectName}/src/main.js`,
                  to: `${this.conf.projectName}/src/main.js`,
                  data: {
                    isMobile,
                    isHybrid,
                    lang: this.conf.lang
                  }
                },
                {
                  from: `${this.conf.projectName}/postcss.config.js`,
                  to: `${this.conf.projectName}/postcss.config.js`,
                  data: {
                    isMobile
                  }
                },
                {
                  from: `${this.conf.projectName}/vue.config.js`,
                  to: `${this.conf.projectName}/vue.config.js`,
                  data: {
                    isMobile,
                    themeReplace: this.conf.themeReplace,
                    installUI: this.conf.installUI
                  }
                },
                {
                  from: `${this.conf.projectName}/src/utils/permission.js`,
                  to: `${this.conf.projectName}/src/utils/permission.js`,
                  data: {
                    isHybrid
                  }
                },
                {
                  from: `${this.conf.projectName}/src/views/Home.vue`,
                  to: `${this.conf.projectName}/src/views/Home.vue`,
                  data: { lang: this.conf.lang, themeReplace: this.conf.themeReplace }
                }
              ];

              const creator = this.template(list);
              console.log(this.conf)
              createApp(creator, this.conf);
            })
            .catch(err => console.log(chalk.red("创建项目失败: ", err)));
        });
      })
    });
  }

  // 模版的下载
  fetchTemplates(template, projectName) {
    // let url = `122687220/web-template#${encodeURI(template)}`;
    // if (template === "default") {
    let url = "122687220/web-template";
    // }
    if (template === 'mini-programme') {
      url = '122687220/web-template#mini-programme'
    }
    if (template === 'vue-plugin') {
      url = '122687220/web-template#vue-plugin'
    }
    
    const filePath = this.templatePath(projectName);

    // 从模板源下载模板122687220/web-template
    return fetchTemplate(url, filePath);
  }

  // 用户的通用问题的集合
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

  // 工程注入的模块问题
  askImportModule() {
    const conf = this.conf;
    const prompts = []
    this.askLang(conf, prompts);
    this.askThemeReplace(conf, prompts);
    return inquirer.prompt(prompts);
  }

  // 询问完上面的内容之后需要继续询问的内容
  askNext(conf) {
    const prompts = [];
    if (!['mini-programme', 'vue-plugin'].includes(this.conf.template)) {
      this.askInstallUI(conf.template, prompts);
    }
    if (conf.gitPush) {
      this.askGitAddress(conf, prompts);
    }
    return inquirer.prompt(prompts);
  }
}
