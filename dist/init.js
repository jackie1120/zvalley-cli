'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createApp;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createApp(creater, params, cb) {
  var projectName = params.projectName,
      _params$autoInstall = params.autoInstall,
      autoInstall = _params$autoInstall === undefined ? true : _params$autoInstall,
      _params$gitPush = params.gitPush,
      gitPush = _params$gitPush === undefined ? false : _params$gitPush;

  // path

  var projectPath = creater.templatePath(projectName);

  // fs commit
  creater.fs.commit(function () {
    // logs
    console.log();
    console.log('' + _chalk2.default.green('✔ ') + _chalk2.default.grey('\u521B\u5EFA\u9879\u76EE: ' + _chalk2.default.grey.bold(projectName)));
    console.log();

    // git init
    //   const gitInitSpinner = ora(`cd ${chalk.cyan.bold(projectName)}, 执行 ${chalk.cyan.bold('git init')}`).start()
    //   process.chdir(projectPath)
    //   const gitInit = exec('git init')
    //   gitInit.on('close', code => {
    //     if (code === 0) {
    //       gitInitSpinner.color = 'green'
    //       gitInitSpinner.succeed(gitInit.stdout.read())
    //     } else {
    //       gitInitSpinner.color = 'red'
    //       gitInitSpinner.fail(gitInit.stderr.read())
    //     }
    //   })

    var callSuccess = function callSuccess() {
      console.log(_chalk2.default.green('\u521B\u5EFA\u9879\u76EE ' + _chalk2.default.green.bold(projectName) + ' \u6210\u529F\uFF01'));
      console.log(_chalk2.default.green('\u8BF7\u8FDB\u5165\u9879\u76EE\u76EE\u5F55 ' + _chalk2.default.green.bold(projectName) + ' \u5F00\u59CB\u5DE5\u4F5C\u5427\uFF01\uD83D\uDE1D'));
      if (typeof cb === 'function') {
        cb();
      }
    };

    var gitPushFunc = function gitPushFunc() {
      var rootPath = creater.getRootPath();
      var gitPushPath = _path2.default.join(rootPath, 'build/gitpush.sh');
      var gitSpinner = (0, _ora2.default)('\u6B63\u5728\u4E0A\u4F20Git\u4ED3\u5E93, \u9700\u8981\u4E00\u4F1A\u513F...').start();
      (0, _child_process.exec)('cd ' + projectPath + ' && ' + gitPushPath, function (error, stdout, stderr) {
        if (error) {
          gitSpinner.color = 'red';
          gitSpinner.fail(_chalk2.default.red('上传Git仓库失败，请自行上传！'));
          console.log(error);
        } else {
          gitSpinner.color = 'green';
          gitSpinner.succeed('上传Git仓库成功');
          console.log('' + stderr + stdout);
        }

        callSuccess();
      });
    };

    var installFunc = function installFunc() {
      // packages install
      var installSpinner = (0, _ora2.default)('\u6267\u884C\u5B89\u88C5\u9879\u76EE\u4F9D\u8D56 ' + _chalk2.default.cyan.bold('npm install') + ', \u9700\u8981\u4E00\u4F1A\u513F...').start();
      (0, _child_process.exec)('cd ' + projectPath + ' && npm install', function (error, stdout, stderr) {
        if (error) {
          installSpinner.color = 'red';
          installSpinner.fail(_chalk2.default.red('安装项目依赖失败，请自行重新安装！'));
          console.log(error);
        } else {
          installSpinner.color = 'green';
          installSpinner.succeed('安装成功');
          console.log('' + stderr + stdout);
        }
        if (gitPush) {
          gitPushFunc();
        } else {
          callSuccess();
        }
      });
    };

    var shouldUseNrm = function shouldUseNrm() {
      try {
        execSync('nrm --version', { stdio: 'ignore' });
        return true;
      } catch (e) {
        return false;
      }
    };

    if (autoInstall) {

      // install nrm
      var rootPath = creater.getRootPath();
      var nrmPath = _path2.default.join(rootPath, 'build/nrm.sh');
      var nrmSpinner = (0, _ora2.default)('\u6B63\u5728\u5B89\u88C5nrm\uFF0C\u5E76\u8BBE\u7F6Enpm\u6E90').start();
      (0, _child_process.exec)(nrmPath, function (error, stdout, stderr) {
        if (error) {
          nrmSpinner.color = 'red';
          nrmSpinner.fail(_chalk2.default.red('nrm安装失败，请自行重新安装！'));
          console.log(error);
        } else {
          nrmSpinner.color = 'green';
          nrmSpinner.succeed('' + _chalk2.default.grey('npm源设置成功！'));
          console.log('' + stderr + stdout);

          installFunc();
        }
      });
    } else {
      callSuccess();
    }
  });
}