#! /usr/bin/env node

const commander = require("commander");
const inquirer = require("inquirer");
const shell = require("shelljs");
const chalk = require("chalk");

// 物料工程仓库
const MATERIAL_URL = "http://gitlab.zoomlion.com/po_web/materials.git";

const questionsList = [{
    type: "list",
    name: "deviceType",
    message: "请选择PC or mobile",
    choices: ["pc", "mobile"],
    filter(val) {
      return val.toLowerCase();
    }
  },
  {
    type: "list",
    name: "componentType",
    message: "请选择 components or views",
    choices: ["components", "views"],
    filter(val) {
      return val.toLowerCase();
    }
  },
  {
    type: "input",
    name: "componentName",
    message: "请输入需要添加的组件或页面名",
    filter(val) {
      return val;
    }
  }
];

inquirer
  .prompt(questionsList)
  .then(({
    deviceType,
    componentType,
    componentName
  }) => {
    console.log(chalk.green("正在构建中... ☕️"));
    const pwd = shell.pwd();
    shell.exec('rm -r material');
    shell.exec(`mkdir material`)
    shell.cd(`./material`);
    shell.exec("rm -rf .git");
    shell.exec("git init");
    shell.exec(`git remote add origin ${MATERIAL_URL}`); // 物料仓库
    shell.exec("git config core.sparseCheckout true");
    // 更新物料库下material的页面
    const filePath = `packages/${deviceType}/src/${componentType}/${componentName}`

    const targetFile = `${filePath}/*`

    shell.exec(
      `echo '${targetFile}' >> .git/info/sparse-checkout`
    );

    if (shell.exec('git pull origin master').code !== 0) {
      console.log(chalk.red("拉取远程仓库失败，请检验网络或者是否存在该物料"))
      shell.exit(1);
    }
    shell.cd('../')
    
    let result = shell.exec(
      `cp -r material/${filePath} ${pwd}/src/${componentType}/${componentName}`
    )

    if (result.code !== 0) {
      console.log(chalk.red(`尝试写入到src/${componentType}/${componentName},发现没有对应的文件夹`))
      shell.exit(1);
    }
    
    shell.exec('rm -r material');
    console.log(chalk.green("添加成功 ☕️！！！"))
  });

// 此行内容落下会使命令行监听失效
commander.parse(process.argv);
