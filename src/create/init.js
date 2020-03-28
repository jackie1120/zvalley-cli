import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { exec } from 'child_process'
import shell from 'shelljs'
import { templates } from 'handlebars';

// createApp 做的内容 主要是安装 npm依赖和 初始化git仓库
export default function createApp (
    creater,
    params,
    cb
  ) {
    const {
      projectName,
      autoInstall = false,
      gitPush = false,
      installUI = false,
      gitAddress,
      template,
      lang
    } = params
    
    // path
    const projectPath = creater.templatePath(projectName)
  
    // fs commit
    creater.fs.commit(() => {
      // logs
      console.log()
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
      console.log()

      // 执行成功之后的提示语
      const callSuccess = () => {
        console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`))
        console.log(chalk.green(`请进入项目目录 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
        console.log('\n To get started')
        console.log(`\n    cd ${projectName}`)
        console.log(`    npm run serve \n`)
        if (typeof cb === 'function') {
          cb()
        }
      }

      // git init
      const gitInit = () => {
        const gitInitSpinner = ora(`⚓ git init...`).start()
        process.chdir(projectPath)
        try {
          const res = shell.exec('git init')
          if (res.code !== 0) {
            gitInitSpinner.color = 'red'
            gitInitSpinner.fail(chalk.red('git init初始化失败'))
          } else {
            gitInitSpinner.color = 'green'
            gitInitSpinner.succeed('git init初始化成功')
          }
        } catch (error) {
          gitInitSpinner.color = 'red'
          gitInitSpinner.fail(chalk.red('git init初始化失败'))
        }
      }

       // 自动关联git仓库执行成功之后的提示语
      const gitPushFunc = () => {
        const gitSpinner = ora(`正在上传Git仓库, 需要一会儿...`).start()
        process.chdir(projectPath)
        try {
          // shell.exec('git init')
          shell.exec('git add .')
          shell.exec('git commit -m "build: first commit"')
          shell.exec(`git remote add origin ${gitAddress}`)
          const res = shell.exec('git push -u origin master')
          if (res.code !== 0) {
            gitSpinner.color = 'red'
            gitSpinner.fail(chalk.red('上传Git仓库失败，请自行上传！'))
          } else {
            gitSpinner.color = 'green'
            gitSpinner.succeed('上传Git仓库成功')
          }
        } catch (error) {
          gitSpinner.color = 'red'
          gitSpinner.fail(chalk.red('上传Git仓库失败，请自行上传！'))
        }

        callSuccess()
      }

      // 自动安装依赖的相关操作
      const installPackage = () => {
        // packages install
        const installSpinner = ora(`执行安装项目依赖 ${chalk.cyan.bold('npm install')}, 需要一会儿...`).start()
        process.chdir(projectPath)
        let src = 'npm install'
        if (lang) {
          src = 'npm install && cd src/lang && npm install'
        }
        exec(src, (error, stdout, stderr) => {
            if (error) {
                installSpinner.color = 'red'
                installSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'))
                console.log(error)
            } else {
                installSpinner.color = 'green'
                installSpinner.succeed('安装成功')
                console.log(`${stderr}${stdout}`)
            }
            if (gitPush) {
              gitPushFunc()
            } else {
              callSuccess()
            }
        })
      }
      
      // 展示用户的 npm 安装地址列表
      const shouldUseNrm = () => {
        try {
          execSync('nrm --version', { stdio: 'ignore' })
          return true
        } catch (e) {
          return false
        }
      }
      
      // 初始化git
      gitInit()

      // 自动安装依赖的时候 切换包的npm地址，并进行安装
      if (autoInstall) {
        // if (template === 'PC端' || template === '移动端-门户开发' || installUI) {
        // 判断nrm是否存在，若存在，则判断是否注册了私有源
        if (shouldUseNrm) {
          exec('nrm ls', (error, stdout, stderr) => {
            if (error) {
              callSuccess()
            } else {
              const registers = `${stdout}`.split(/\n/)
              
              let dic = {
                exist: false,
                current: false
              }
            
              registers.forEach(item => {
                if (item.indexOf('http://registry.lhanyun.com/') !== -1) {
                  dic.exist = true
                  if (item.indexOf('*') !== -1) {
                    dic.current = true
                  }
                }
              })
              
              let err
              const nrmSpinner1 = ora(`正在设置npm源`).start();
              try {
                if (!dic.exist) {
                  shell.exec('nrm add zv http://registry.lhanyun.com/')
                  shell.exec('nrm use zv')
                } else if (!dic.current) {
                  shell.exec('nrm use zv')
                }
                nrmSpinner1.color = 'green'
                nrmSpinner1.succeed(`${chalk.grey('npm源设置成功！')}`);
              } catch (error) {
                err = error
                nrmSpinner1.color = 'red'
                nrmSpinner1.fail(chalk.red('npm源设置失败，请自行设置并重新安装！'))

                callSuccess()
              }

              if (!err) {
                installPackage()
              }
            }
          })
        } else {
          const rootPath = creater.getRootPath()
          const nrmPath = path.join(rootPath, 'build/nrm.sh')
          const nrmSpinner = ora(`正在安装nrm，并设置npm源`).start();
          exec(nrmPath, (error, stdout, stderr) => {
              if (error) {
                  nrmSpinner.color = 'red'
                  nrmSpinner.fail(chalk.red('nrm安装失败，请自行重新安装！'))
                  console.log(error)
              } else {
                  nrmSpinner.color = 'green'
                  nrmSpinner.succeed(`${chalk.grey('npm源设置成功！')}`);
                  installPackage()
              }
          })
        }
      } else {
        callSuccess()
      }
    })
  }