#!/usr/bin/env node
const fs = require('fs')
const program = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const download = require('download-git-repo')
const tplObj = require(`${__dirname}/../template`)

// 交互式命令行
const inquirer = require('inquirer')

program
  .usage('[options] <project-name>')
  .on('--help', () => {
    console.log('Example:')
    console.log('  创建一个默认的项目')
    console.log('     $ zv init d hello-world')
    console.log('\n  选择模板 指定项目名的项目')
    console.log('     $ zv init hello-world \n')
  })
program.parse(process.argv)

let projectName
let option
if (program.args.length < 1 || program.args.length > 2) {

  return program.help()
} else if (program.args.length === 1) {

  projectName = program.args[0]
  if (!verifyProjectName(projectName)) { return }
} else {

  option = program.args[0]
  if (option !== 'd') {

    return program.help()
  } else {

    option = program.args[0]
    projectName = program.args[1]
    if (!verifyProjectName(projectName)) { return }
  }
}

option === 'd' ? downloadTemplate() : chooseTemplate()

function chooseTemplate() {
  // 自定义交互式命令行的问题及简单的校验
  let question = [
    {
      name: "type",
      type: 'list',
      message: "请选择模板",
      choices: [
        "移动端",
        "PC端",
        "多页应用"
      ]
    },
    {
      type: "confirm",
      message: "是否使用多语言?",
      name: "locale"
    }
  ]

  inquirer
    .prompt(question).then(answers => {

    // answers 就是用户输入的内容，是个对象
    let { type, locale } = answers

    downloadTemplate(type)
  })
}

function downloadTemplate(type) {
  const url = type ? `122687220/web-template#${encodeURI(type)}` : '122687220/web-template'
  console.log(chalk.white('\n Start generating... \n'))
// 出现加载图标
  const spinner = ora("Downloading...")
  spinner.start()

// 执行下载方法并传入参数
  download (
    url,
    projectName,
    err => {
      if (err) {
        spinner.fail();
        console.log(chalk.red(`Generation failed. ${err}`))
      } else {
        // 结束加载图标
        spinner.succeed();
        console.log(chalk.green('\n Generation completed!'))
        console.log('\n To get started')
        console.log(`\n    cd ${projectName} \n`)
        console.log(`\n    npm i \n`)
        console.log(`\n    npm run serve \n`)
      }
    }
  )
}

function verifyProjectName(projectName) {

  if (projectName.match(/[A-Z]/)) {
    console.log(chalk.red(`\n Invalid project name: ${projectName}`))
    console.log(chalk.red('\n Name can no longer contain capital letters'))
    return false
  }

  const files = fs.readdirSync('./')
  if (files.indexOf(projectName) > -1) {
    console.log(chalk.red(`\n File has already existed!`))
    return false
  }

  return true
}
