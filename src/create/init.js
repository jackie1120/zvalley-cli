import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { exec } from 'child_process'

export default function createApp (
    creater,
    params,
    cb
  ) {
    const {
      projectName,
      autoInstall = true,
      gitPush = false
    } = params
    
    // path
    const projectPath = creater.templatePath(projectName)
  
    // fs commit
    creater.fs.commit(() => {
      // logs
      console.log()
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
      console.log()
  
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
  
      const callSuccess = () => {
        console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`))
        console.log(chalk.green(`请进入项目目录 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
        if (typeof cb === 'function') {
          cb()
        }
      }

      const gitPushFunc = () => {
        const rootPath = creater.getRootPath()
        const gitPushPath = path.join(rootPath, 'build/gitpush.sh')
        const gitSpinner = ora(`正在上传Git仓库, 需要一会儿...`).start()
        exec(`cd ${projectPath} && ${gitPushPath}`, (error, stdout, stderr) => {
            if (error) {
                gitSpinner.color = 'red'
                gitSpinner.fail(chalk.red('上传Git仓库失败，请自行上传！'))
                console.log(error)
            } else {
                gitSpinner.color = 'green'
                gitSpinner.succeed('上传Git仓库成功')
                console.log(`${stderr}${stdout}`)
            }

            callSuccess()
        })
      }

      const installFunc = () => {
        // packages install
        const installSpinner = ora(`执行安装项目依赖 ${chalk.cyan.bold('npm install')}, 需要一会儿...`).start()
        exec(`cd ${projectPath} && npm install`, (error, stdout, stderr) => {
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

      const shouldUseNrm = () => {
        try {
          execSync('nrm --version', { stdio: 'ignore' })
          return true
        } catch (e) {
          return false
        }
      }
  
      if (autoInstall) {
        // install nrm
        /**
         * 判断nrm是否存在，若存在，则判断是否注册了私有源
         */
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
                console.log(`${stderr}${stdout}`)
                
                installFunc()
            }
        })
      } else {
        callSuccess()
      }
  
      
    })
  }