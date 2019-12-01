import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { exec } from 'child_process'
import shell from 'shelljs'

export default function createApp (
    creater,
    params,
    cb
  ) {
    const {
      projectName,
      autoInstall = true,
      gitPush = false,
      gitAddress
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
        console.log('\n To get started')
        console.log(`\n    cd ${projectName}`)
        console.log(`      npm run serve \n`)
        if (typeof cb === 'function') {
          cb()
        }
      }

      const gitPushFunc = () => {
        const gitSpinner = ora(`正在上传Git仓库, 需要一会儿...`).start()
        process.chdir(projectPath)
        try {
          shell.exec('git init')
          shell.exec('git add .')
          shell.exec('git commit -m "first commit"')
          shell.exec(`git remote add origin ${gitAddress}`)
          const res = shell.exec('git pull --rebase origin master')
          if (res.code !== 0) {
            gitSpinner.color = 'red'
            gitSpinner.fail(chalk.red('上传Git仓库失败，请自行上传！'))
          } else {
            const res1 = shell.exec('git push -u origin master')
            if (res1.code !== 0) {
              gitSpinner.color = 'red'
              gitSpinner.fail(chalk.red('上传Git仓库失败，请自行上传！'))
            } else {
              gitSpinner.color = 'green'
              gitSpinner.succeed('上传Git仓库成功')
            }
          }
        } catch (error) {
          gitSpinner.color = 'red'
          gitSpinner.fail(chalk.red('上传Git仓库失败，请自行上传！'))
        }

        callSuccess()
        // const rootPath = creater.getRootPath()
        // const gitPushPath = path.join(rootPath, 'build/gitpush.sh')
        // console.log(gitPushPath)
        // exec(gitPushPath, (error, stdout, stderr) => {
        //     if (error) {
        //         // gitSpinner.color = 'red'
        //         // gitSpinner.fail(chalk.red('上传Git仓库失败，请自行上传！'))
        //         console.log(error)
        //     } else {
        //         // gitSpinner.color = 'green'
        //         // gitSpinner.succeed('上传Git仓库成功')
        //         console.log(`${stderr}${stdout}`)
        //     }

        //     callSuccess()
        // })
      }

      const installPackage = () => {
        // packages install
        const installSpinner = ora(`执行安装项目依赖 ${chalk.cyan.bold('npm install')}, 需要一会儿...`).start()
        process.chdir(projectPath)
        exec('npm install', (error, stdout, stderr) => {
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
        /**
         * 判断nrm是否存在，若存在，则判断是否注册了私有源
         */
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