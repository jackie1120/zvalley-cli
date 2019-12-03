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

    _createClass(Creator, [{
        key: 'init',
        value: function init() {}
    }, {
        key: 'templatePath',
        value: function templatePath(name) {
            var cwd = process.cwd();
            var filepath = _path2.default.join(cwd, name);
            return filepath;
        }
    }, {
        key: 'getRootPath',
        value: function getRootPath() {
            return _path2.default.resolve(__dirname, '../');
        }
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
                    _this.fs.copyTpl(fromPath, toPath, data);
                }
            });

            return this;
        }
    }, {
        key: 'copyTemplate',
        value: function copyTemplate(from, to) {
            var rootPath = this.getRootPath();
            var fromPath = _path2.default.join(rootPath, from);
            var toPath = this.templatePath(to);
            _fsExtra2.default.mkdirSync(toPath);
            this.fs.copy(fromPath, toPath);
        }
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