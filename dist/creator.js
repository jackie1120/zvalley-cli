'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _memFs = require('mem-fs');

var _memFs2 = _interopRequireDefault(_memFs);

var _memFsEditor = require('mem-fs-editor');

var _memFsEditor2 = _interopRequireDefault(_memFsEditor);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Creator = function () {
    function Creator() {
        _classCallCheck(this, Creator);

        var store = _memFs2.default.create();
        this.fs = _memFsEditor2.default.create(store);
        this.init();
    }

    // 初始化的相关内容


    _createClass(Creator, [{
        key: 'init',
        value: function init() {}

        // 获取模版的路径

    }, {
        key: 'templatePath',
        value: function templatePath(name) {
            var cwd = process.cwd();
            var filepath = _path2.default.join(cwd, name);
            return filepath;
        }

        // 获取根目录的路径

    }, {
        key: 'getRootPath',
        value: function getRootPath() {
            return _path2.default.resolve(__dirname, '../');
        }

        // 将对应的模版替换到工程的位置 参数为Array
        // 每个Array的item中的参数需要有from, to, data

    }, {
        key: 'template',
        value: function template(list) {
            var _this = this;

            list.forEach(function (item) {
                var from = item.from,
                    to = item.to,
                    data = item.data;


                var fromPath = _this.templatePath(from);
                var toPath = _this.templatePath(to);

                if (!_fsExtra2.default.existsSync(fromPath)) {
                    console.log(_chalk2.default.red(fromPath + '\u6A21\u677F\u8DEF\u5F84\u4E0D\u5B58\u5728'));
                } else {
                    // 替换对应的文件中的模版语法
                    _this.fs.copyTpl(fromPath, toPath, data);
                }
            });

            return this;
        }

        // 复制对应的模版到工程中去，当是js/vue/html时是复制文件，其他的是创建文件

    }, {
        key: 'copyTemplate',
        value: function copyTemplate(from, to) {
            var rootPath = this.getRootPath();
            var fromPath = _path2.default.join(rootPath, from);
            var toPath = this.templatePath(to);

            if (!_fsExtra2.default.existsSync(toPath)) {
                if (/\.(js|vue|html)$/.test(toPath)) {
                    _fsExtra2.default.writeFileSync(toPath);
                } else {
                    _fsExtra2.default.mkdirSync(toPath);
                }
            }

            this.fs.copy(fromPath, toPath);
        }

        // 项目/框架初始化时保留一些空文件，批量新增gitkeep

    }, {
        key: 'writeGitKeepFile',
        value: function writeGitKeepFile(dirname) {
            dirname = _path2.default.resolve(dirname);
            _fsExtra2.default.writeFileSync(_path2.default.join(dirname, '.gitkeep'), 'Place hold file', 'utf8');
        }
    }, {
        key: 'write',
        value: function write() {}
    }]);

    return Creator;
}();

exports.default = Creator;