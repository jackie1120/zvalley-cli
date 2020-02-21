"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

var _semver = require("semver");

var _semver2 = _interopRequireDefault(_semver);

var _fetchTemplate = require("./fetchTemplate");

var _fetchTemplate2 = _interopRequireDefault(_fetchTemplate);

var _creator = require("./creator");

var _creator2 = _interopRequireDefault(_creator);

var _init = require("./init");

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Project = function (_Creator) {
  _inherits(Project, _Creator);

  function Project(options) {
    _classCallCheck(this, Project);

    // 询问用户工程的名字
    var _this = _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, options.sourceRoot));

    _this.askProjectName = function (conf, prompts) {
      if (typeof conf.projectName !== "string") {
        prompts.push({
          type: "input",
          name: "projectName",
          message: "请输入项目名称！",
          validate: function validate(input) {
            if (!input) {
              return "项目名不能为空！";
            }
            if (_fsExtra2.default.existsSync(input)) {
              return "当前目录已经存在同名项目，请换一个项目名！";
            }
            return true;
          }
        });
      } else if (_fsExtra2.default.existsSync(conf.projectName)) {
        prompts.push({
          type: "input",
          name: "projectName",
          message: "当前目录已经存在同名项目，请换一个项目名！",
          validate: function validate(input) {
            if (!input) {
              return "项目名不能为空！";
            }
            if (_fsExtra2.default.existsSync(input)) {
              return "项目名依然重复！";
            }
            return true;
          }
        });
      }
    };
    // 询问用户工程的相关描述
    _this.askDescription = function (conf, prompts) {
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
    _this.askTemplate = function (conf, prompts) {
      var choices = [{
        name: "PC端",
        value: "default"
      }, {
        name: "H5",
        value: "H5"
      }, {
        name: "混合开发",
        value: "Hybrid"
      }];
      if (typeof conf.template !== "string") {
        prompts.push({
          type: "list",
          name: "template",
          message: "请选择模板",
          choices: choices
        });
      }
    };
    // 询问用户是否需要自动安装依赖
    _this.askInstall = function (conf, prompts) {
      prompts.push({
        type: "confirm",
        name: "autoInstall",
        message: "是否自动安装项目依赖包 ？"
      });
    };
    // 询问用户否上传至远程Git仓库
    _this.askPush = function (conf, prompts) {
      prompts.push({
        type: "confirm",
        name: "gitPush",
        message: "是否上传至远程Git仓库 ？"
      });
    };
    // 询问用户远程Git仓库的地址
    _this.askGitAddress = function (conf, prompts) {
      prompts.push({
        type: "input",
        name: "gitAddress",
        message: "请输入远程仓库地址！",
        validate: function validate(input) {
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
    _this.askLang = function (conf, prompts) {
      prompts.push({
        type: "confirm",
        name: "lang",
        message: "是否添加国际化包 ？"
      });
    };
    // 询问用户是否添加是否添加换肤相关包
    _this.askThemeReplace = function (conf, prompts) {
      prompts.push({
        type: "confirm",
        name: "themeReplace",
        message: "是否添加换肤相关包 ？"
      });
    };
    // 询问用户是否安装自己的UI库
    _this.askInstallUI = function (template, prompts) {
      var message = template === "default" ? "是否安装element-ui ？" : "是否安装vant-ui ？";
      prompts.push({
        type: "confirm",
        name: "installUI",
        message: message
      });
    };

    // 判断node的版本 版本过低的时候添加提示
    var unSupportedVer = _semver2.default.lt(process.version, "v7.6.0");
    if (unSupportedVer) {
      throw new Error("Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+");
    }

    // 默认的配置项
    _this.conf = Object.assign({
      projectName: "",
      projectDir: "",
      template: "",
      description: "",
      gitAddress: "",
      lang: false,
      themeReplace: false,
      autoInstall: false,
      installUI: false
    }, options);
    return _this;
  }

  // 初始化的控制台输出


  _createClass(Project, [{
    key: "init",
    value: function init() {
      console.log(_chalk2.default.green("zvalley-cli\u5373\u5C06\u521B\u5EFA\u4E00\u4E2A\u65B0\u9879\u76EE!"));
      console.log("Need help? Go and open issue: https://github.com/122687220/web-template/issues/new");
      console.log();
    }

    // 询问问题之后功能的实现
    // 模版的替换

  }, {
    key: "create",
    value: function create() {
      var _this2 = this;

      this.ask().then(function (answers) {
        _this2.conf = Object.assign(_this2.conf, answers);
        _this2.askNext(_this2.conf).then(function (answers) {
          _this2.conf = Object.assign(_this2.conf, answers);
          _this2.fetchTemplates(_this2.conf.template, _this2.conf.projectName).then(function () {
            // 判断是否是手机环境的 
            var isMobile = _this2.conf.template !== 'default';
            // 判断是否是混合开发环境
            var isHybrid = isMobile && _this2.conf.template === 'Hybrid';
            // copy国际化文件包
            if (_this2.conf.lang) {
              _this2.copyTemplate("templates/lang", _this2.conf.projectName + "/src/lang");
            }
            // copy主题色换肤文件包
            if (_this2.conf.themeReplace) {
              _this2.copyTemplate("templates/themeColorReplace", _this2.conf.projectName + "/src/utils");
            }

            // 注入原生包
            if (isHybrid) {
              _this2.copyTemplate("templates/hybrid", _this2.conf.projectName + "/src/utils");
            }

            // 组件库的添加 手机端添加 vant-ui / pc安装 element-ui
            if (_this2.conf.installUI) {
              if (_this2.conf.template !== "default") {
                _this2.copyTemplate("templates/mobile/babel.config.js", _this2.conf.projectName + "/babel.config.js");
                _this2.copyTemplate("templates/mobile/vant_ui.js", _this2.conf.projectName + "/src/plugins/vant-ui.js");
              } else {
                _this2.copyTemplate("templates/pc/babel.config.js", _this2.conf.projectName + "/babel.config.js");
                _this2.copyTemplate("templates/pc/element_ui.js", _this2.conf.projectName + "/src/plugins/element_ui.js");
              }
            }

            // 为各文件添加模板代码
            var list = [{
              from: _this2.conf.projectName + "/package.json",
              to: _this2.conf.projectName + "/package.json",
              data: {
                isMobile: isMobile,
                isHybrid: isHybrid,
                name: _this2.conf.projectName,
                description: _this2.conf.description,
                themeReplace: _this2.conf.themeReplace,
                lang: _this2.conf.lang,
                installUI: _this2.conf.installUI
              }
            }, {
              from: _this2.conf.projectName + "/public/index.html",
              to: _this2.conf.projectName + "/public/index.html",
              data: { title: _this2.conf.projectName }
            }, {
              from: _this2.conf.projectName + "/src/main.js",
              to: _this2.conf.projectName + "/src/main.js",
              data: {
                isMobile: isMobile,
                isHybrid: isHybrid,
                lang: _this2.conf.lang
              }
            }, {
              from: _this2.conf.projectName + "/postcss.config.js",
              to: _this2.conf.projectName + "/postcss.config.js",
              data: {
                isMobile: isMobile
              }
            }, {
              from: _this2.conf.projectName + "/vue.config.js",
              to: _this2.conf.projectName + "/vue.config.js",
              data: {
                isMobile: isMobile,
                themeReplace: _this2.conf.themeReplace,
                installUI: _this2.conf.installUI
              }
            }, {
              from: _this2.conf.projectName + "/src/utils/permission.js",
              to: _this2.conf.projectName + "/src/utils/permission.js",
              data: {
                isHybrid: isHybrid
              }
            }, {
              from: _this2.conf.projectName + "/src/views/Home.vue",
              to: _this2.conf.projectName + "/src/views/Home.vue",
              data: { lang: _this2.conf.lang, themeReplace: _this2.conf.themeReplace }
            }];

            var creator = _this2.template(list);
            console.log(_this2.conf);
            (0, _init2.default)(creator, _this2.conf);
          }).catch(function (err) {
            return console.log(_chalk2.default.red("创建项目失败: ", err));
          });
        });
      });
    }

    // 模版的下载

  }, {
    key: "fetchTemplates",
    value: function fetchTemplates(template, projectName) {
      // let url = `122687220/web-template#${encodeURI(template)}`;
      // if (template === "default") {
      var url = "122687220/web-template";
      // }

      var filePath = this.templatePath(projectName);

      // 从模板源下载模板122687220/web-template
      return (0, _fetchTemplate2.default)(url, filePath);
    }

    // 用户的所有问题的集合

  }, {
    key: "ask",
    value: function ask() {
      var prompts = [];
      var conf = this.conf;
      this.askProjectName(conf, prompts);
      this.askDescription(conf, prompts);
      this.askTemplate(conf, prompts);
      this.askLang(conf, prompts);
      this.askThemeReplace(conf, prompts);
      this.askInstall(conf, prompts);
      this.askPush(conf, prompts);
      return _inquirer2.default.prompt(prompts);
    }
    // 询问完上面的内容之后需要继续询问的内容

  }, {
    key: "askNext",
    value: function askNext(conf) {
      var prompts = [];
      this.askInstallUI(conf.template, prompts);
      if (conf.gitPush) {
        this.askGitAddress(prompts);
      }
      return _inquirer2.default.prompt(prompts);
    }
  }]);

  return Project;
}(_creator2.default);

exports.default = Project;