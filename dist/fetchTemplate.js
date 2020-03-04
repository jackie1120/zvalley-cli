'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = fetchTemplate;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _downloadGitRepo = require('download-git-repo');

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


// 下载远程的项目模版函数
function fetchTemplate(templateSource, templatePath) {
    var _this = this;

    var clone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    return new Promise(function (resolve, reject) {
        return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var _this2 = this;

            var spinner;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (!_fsExtra2.default.existsSync(templatePath)) {
                                _context3.next = 3;
                                break;
                            }

                            _context3.next = 3;
                            return _fsExtra2.default.remove(templatePath);

                        case 3:
                            _context3.next = 5;
                            return _fsExtra2.default.mkdir(templatePath);

                        case 5:
                            spinner = (0, _ora2.default)('\u6B63\u5728\u4ECE ' + templateSource + ' \u62C9\u53D6\u8FDC\u7A0B\u6A21\u677F...').start();


                            if (clone) {
                                (0, _downloadGitRepo2.default)(templateSource, templatePath, {
                                    clone: true
                                }, function (error) {
                                    return __awaiter(_this2, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        if (!error) {
                                                            _context.next = 6;
                                                            break;
                                                        }

                                                        spinner.color = 'red';
                                                        spinner.fail(_chalk2.default.red('拉取远程模板仓库失败！'));
                                                        _context.next = 5;
                                                        return _fsExtra2.default.remove(templatePath);

                                                    case 5:
                                                        resolve();

                                                    case 6:
                                                        spinner.color = 'green';
                                                        spinner.succeed('' + _chalk2.default.grey('拉取远程模板仓库成功！'));
                                                        resolve();

                                                    case 9:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, this);
                                    }));
                                });
                            } else {
                                (0, _downloadGitRepo2.default)(templateSource, templatePath, function (error) {
                                    return __awaiter(_this2, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        if (!error) {
                                                            _context2.next = 6;
                                                            break;
                                                        }

                                                        spinner.color = 'red';
                                                        spinner.fail(_chalk2.default.red('拉取远程模板仓库失败！'));
                                                        _context2.next = 5;
                                                        return _fsExtra2.default.remove(templatePath);

                                                    case 5:
                                                        resolve();

                                                    case 6:
                                                        spinner.color = 'green';
                                                        spinner.succeed('' + _chalk2.default.grey('拉取远程模板仓库成功！'));
                                                        resolve();

                                                    case 9:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, this);
                                    }));
                                });
                            }

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));
    });
}