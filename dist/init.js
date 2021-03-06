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

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _handlebars = require('handlebars');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// createApp 做的内容 主要是安装 npm依赖和 初始化git仓库
function createApp(creater, params, cb) {
  var projectName = params.projectName,
      _params$autoInstall = params.autoInstall,
      autoInstall = _params$autoInstall === undefined ? false : _params$autoInstall,
      _params$gitPush = params.gitPush,
      gitPush = _params$gitPush === undefined ? false : _params$gitPush,
      _params$installUI = params.installUI,
      installUI = _params$installUI === undefined ? false : _params$installUI,
      gitAddress = params.gitAddress,
      template = params.template,
      lang = params.lang;

  // path

  var projectPath = creater.templatePath(projectName);

  // fs commit
  creater.fs.commit(function () {
    // logs
    console.log();
    console.log('' + _chalk2.default.green('✔ ') + _chalk2.default.grey('\u521B\u5EFA\u9879\u76EE: ' + _chalk2.default.grey.bold(projectName)));
    console.log();

    // 执行成功之后的提示语
    var callSuccess = function callSuccess() {
      console.log(_chalk2.default.green('\u521B\u5EFA\u9879\u76EE ' + _chalk2.default.green.bold(projectName) + ' \u6210\u529F\uFF01'));
      console.log(_chalk2.default.green('\u8BF7\u8FDB\u5165\u9879\u76EE\u76EE\u5F55 ' + _chalk2.default.green.bold(projectName) + ' \u5F00\u59CB\u5DE5\u4F5C\u5427\uFF01\uD83D\uDE1D'));
      console.log('\n To get started');
      console.log('\n    cd ' + projectName);
      console.log('    npm run serve \n');
      if (typeof cb === 'function') {
        cb();
      }
    };

    // git init
    var gitInit = function gitInit() {
      var gitInitSpinner = (0, _ora2.default)('\u2693 git init...').start();
      process.chdir(projectPath);
      try {
        var res = _shelljs2.default.exec('git init');
        if (res.code !== 0) {
          gitInitSpinner.color = 'red';
          gitInitSpinner.fail(_chalk2.default.red('git init初始化失败'));
        } else {
          gitInitSpinner.color = 'green';
          gitInitSpinner.succeed('git init初始化成功');
        }
      } catch (error) {
        gitInitSpinner.color = 'red';
        gitInitSpinner.fail(_chalk2.default.red('git init初始化失败'));
      }
    };
    //   let gitInit = () => {
    //     const gitInitSpinner = ora(`⚓ git init...`).start()
    //     process.chdir(projectPath)
    //     child.exec(`git init`, () => {
    //         console.log(symbol.success, chalk.green('git 初始化完成'));
    //         child.exec(`npm install`, (error, stdout, stderr) => {
    //             console.log(symbol.success, chalk.green(stdout));
    //             console.log(symbol.error,  chalk.red(stderr));
    //             if (error !== null) {
    //                 console.log(symbol.error, chalk.red(error));
    //             }else{
    //                 console.log(symbol.success,  chalk.green('npm依赖安装完成'));
    //             }
    //         },(err)=> {
    //             console.log(err)
    //         })
    //     },(err)=> {
    //         console.log(err)
    //     })
    // }

    // 自动关联git仓库执行成功之后的提示语
    var gitPushFunc = function gitPushFunc() {
      var gitSpinner = (0, _ora2.default)('\u6B63\u5728\u4E0A\u4F20Git\u4ED3\u5E93, \u9700\u8981\u4E00\u4F1A\u513F...').start();
      process.chdir(projectPath);
      try {
        // shell.exec('git init')
        _shelljs2.default.exec('git add .');
        _shelljs2.default.exec('git commit -m "build: first commit"');
        _shelljs2.default.exec('git remote add origin ' + gitAddress);
        var res = _shelljs2.default.exec('git push -u origin master');
        if (res.code !== 0) {
          gitSpinner.color = 'red';
          gitSpinner.fail(_chalk2.default.red('上传Git仓库失败，请自行上传！'));
        } else {
          gitSpinner.color = 'green';
          gitSpinner.succeed('上传Git仓库成功');
        }
      } catch (error) {
        gitSpinner.color = 'red';
        gitSpinner.fail(_chalk2.default.red('上传Git仓库失败，请自行上传！'));
      }

      callSuccess();
    };

    // 自动安装依赖的相关操作
    var installPackage = function installPackage() {
      // packages install
      var installSpinner = (0, _ora2.default)('\u6267\u884C\u5B89\u88C5\u9879\u76EE\u4F9D\u8D56 ' + _chalk2.default.cyan.bold('npm install') + ', \u9700\u8981\u4E00\u4F1A\u513F...').start();
      process.chdir(projectPath);
      var src = 'npm install';
      if (lang) {
        src = 'npm install && cd src/lang && npm install';
      }
      (0, _child_process.exec)(src, function (error, stdout, stderr) {
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

    // 展示用户的 npm 安装地址列表
    var shouldUseNrm = function shouldUseNrm() {
      try {
        execSync('nrm --version', { stdio: 'ignore' });
        return true;
      } catch (e) {
        return false;
      }
    };

    // 初始化git
    // gitInit()

    // 自动安装依赖的时候 切换包的npm地址，并进行安装
    if (autoInstall) {
      // if (template === 'PC端' || template === '移动端-门户开发' || installUI) {
      // 判断nrm是否存在，若存在，则判断是否注册了私有源
      if (shouldUseNrm) {
        (0, _child_process.exec)('nrm ls', function (error, stdout, stderr) {
          if (error) {
            callSuccess();
          } else {
            var registers = ('' + stdout).split(/\n/);

            var dic = {
              exist: false,
              current: false
            };

            registers.forEach(function (item) {
              if (item.indexOf('http://registry.lhanyun.com/') !== -1) {
                dic.exist = true;
                if (item.indexOf('*') !== -1) {
                  dic.current = true;
                }
              }
            });

            var err = void 0;
            var nrmSpinner1 = (0, _ora2.default)('\u6B63\u5728\u8BBE\u7F6Enpm\u6E90').start();
            try {
              if (!dic.exist) {
                _shelljs2.default.exec('nrm add zv http://registry.lhanyun.com/');
                _shelljs2.default.exec('nrm use zv');
              } else if (!dic.current) {
                _shelljs2.default.exec('nrm use zv');
              }
              nrmSpinner1.color = 'green';
              nrmSpinner1.succeed('' + _chalk2.default.grey('npm源设置成功！'));
            } catch (error) {
              err = error;
              nrmSpinner1.color = 'red';
              nrmSpinner1.fail(_chalk2.default.red('npm源设置失败，请自行设置并重新安装！'));

              callSuccess();
            }

            if (!err) {
              installPackage();
            }
          }
        });
      } else {
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
            installPackage();
          }
        });
      }
    } else {
      callSuccess();
    }
  });
}