'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _fetchTemplate = require('./fetchTemplate');

var _fetchTemplate2 = _interopRequireDefault(_fetchTemplate);

var _creator = require('./creator');

var _creator2 = _interopRequireDefault(_creator);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Project = function (_Creator) {
    _inherits(Project, _Creator);

    function Project(options) {
        _classCallCheck(this, Project);

        var _this = _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, options.sourceRoot));

        _this.askProjectName = function (conf, prompts) {
            if (typeof conf.projectName !== 'string') {
                prompts.push({
                    type: 'input',
                    name: 'projectName',
                    message: '请输入项目名称！',
                    validate: function validate(input) {
                        if (!input) {
                            return '项目名不能为空！';
                        }
                        if (_fsExtra2.default.existsSync(input)) {
                            return '当前目录已经存在同名项目，请换一个项目名！';
                        }
                        return true;
                    }
                });
            } else if (_fsExtra2.default.existsSync(conf.projectName)) {
                prompts.push({
                    type: 'input',
                    name: 'projectName',
                    message: '当前目录已经存在同名项目，请换一个项目名！',
                    validate: function validate(input) {
                        if (!input) {
                            return '项目名不能为空！';
                        }
                        if (_fsExtra2.default.existsSync(input)) {
                            return '项目名依然重复！';
                        }
                        return true;
                    }
                });
            }
        };
        _this.askDescription = function (conf, prompts) {
            if (typeof conf.description !== 'string') {
                prompts.push({
                    type: 'input',
                    name: 'description',
                    message: '请输入项目介绍！'
                });
            }
        };
        _this.askTemplate = function (conf, prompts) {
            var choices = [{
                name: '默认模板',
                value: 'default'
            }, {
                name: '移动端',
                value: '移动端'
            }, {
                name: '移动端-门户开发',
                value: '移动端-门户开发'
            }, {
                name: 'PC端',
                value: 'PC端'
            }, {
                name: '多页应用',
                value: '多页应用'
            }];
            if (typeof conf.template !== 'string') {
                prompts.push({
                    type: 'list',
                    name: 'template',
                    message: '请选择模板',
                    choices: choices
                });
            }
        };
        _this.askInstall = function (conf, prompts) {
            prompts.push({
                type: 'confirm',
                name: 'autoInstall',
                message: '是否自动安装项目依赖包 ？'
            });
        };
        _this.askPush = function (conf, prompts) {
            prompts.push({
                type: 'confirm',
                name: 'gitPush',
                message: '是否上传至远程Git仓库 ？'
            });
        };
        _this.askGitAddress = function (prompts) {
            prompts.push({
                type: 'input',
                name: 'gitAddress',
                message: '请输入远程仓库地址！',
                validate: function validate(input) {
                    if (!input) {
                        return '仓库地址不能为空！';
                    }
                    if (!/^http:/.test(input) && !/^https:/.test(input)) {
                        return '仓库地址必须以https或者http开头！';
                    }
                    return true;
                }
            });
        };
        _this.askLang = function (prompts) {
            prompts.push({
                type: 'confirm',
                name: 'lang',
                message: '是否添加国际化包 ？'
            });
        };

        var unSupportedVer = _semver2.default.lt(process.version, 'v7.6.0');
        if (unSupportedVer) {
            throw new Error('Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+');
        }

        _this.conf = Object.assign({
            projectName: '',
            projectDir: '',
            template: '',
            description: '',
            gitAddress: '',
            lang: false
        }, options);
        return _this;
    }

    _createClass(Project, [{
        key: 'init',
        value: function init() {
            console.log(_chalk2.default.green('zvalley-cli\u5373\u5C06\u521B\u5EFA\u4E00\u4E2A\u65B0\u9879\u76EE!'));
            console.log('Need help? Go and open issue: https://github.com/122687220/web-template/issues/new');
            console.log();
        }
    }, {
        key: 'create',
        value: function create() {
            var _this2 = this;

            this.ask().then(function (answers) {
                _this2.conf = Object.assign(_this2.conf, answers);
                _this2.askNext(_this2.conf).then(function (answers) {
                    _this2.conf = Object.assign(_this2.conf, answers);
                    _this2.fetchTemplates(_this2.conf.template, _this2.conf.projectName).then(function () {
                        // copy国际化文件包
                        if (_this2.conf.lang) {
                            _this2.copyTemplate('templates/lang', _this2.conf.projectName + '/src/lang');
                        }

                        // 为各文件添加模板代码
                        var list = [{
                            from: _this2.conf.projectName + '/package.json',
                            to: _this2.conf.projectName + '/package.json',
                            data: { name: _this2.conf.projectName, description: _this2.conf.description, lang: _this2.conf.lang }
                        }, {
                            from: _this2.conf.projectName + '/public/index.html',
                            to: _this2.conf.projectName + '/public/index.html',
                            data: { title: _this2.conf.projectName }
                        }];

                        if (_this2.conf.template === 'default' || _this2.conf.template === '移动端') {
                            list = list.concat([{
                                from: _this2.conf.projectName + '/src/main.js',
                                to: _this2.conf.projectName + '/src/main.js',
                                data: { lang: _this2.conf.lang }
                            }, {
                                from: _this2.conf.projectName + '/src/views/Home.vue',
                                to: _this2.conf.projectName + '/src/views/Home.vue',
                                data: { lang: _this2.conf.lang }
                            }]);
                        }
                        var creator = _this2.template(list);

                        (0, _init2.default)(creator, _this2.conf);
                    }).catch(function (err) {
                        return console.log(_chalk2.default.red('创建项目失败: ', err));
                    });
                });
            });
        }
    }, {
        key: 'fetchTemplates',
        value: function fetchTemplates(template, projectName) {
            var url = '122687220/web-template#' + encodeURI(template);
            if (template === 'default') {
                url = '122687220/web-template';
            }

            var filePath = this.templatePath(projectName);

            // 从模板源下载模板122687220/web-template
            return (0, _fetchTemplate2.default)(url, filePath);
        }
    }, {
        key: 'ask',
        value: function ask() {
            var prompts = [];
            var conf = this.conf;
            this.askProjectName(conf, prompts);
            this.askDescription(conf, prompts);
            this.askTemplate(conf, prompts);
            this.askInstall(conf, prompts);
            this.askPush(conf, prompts);
            return _inquirer2.default.prompt(prompts);
        }
    }, {
        key: 'askNext',
        value: function askNext(conf) {
            var prompts = [];
            if (conf.gitPush) {
                this.askGitAddress(prompts);
            }
            if (conf.template === 'default' || conf.template === '移动端') {
                this.askLang(prompts);
            }
            return _inquirer2.default.prompt(prompts);
        }
    }]);

    return Project;
}(_creator2.default);

exports.default = Project;