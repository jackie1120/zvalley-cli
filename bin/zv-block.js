#! /usr/bin/env node

const commander = require("commander");
const inquirer = require("inquirer");
const shell = require("shelljs");

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
    console.log("正在构建中... ☕️");
    const pwd = shell.pwd();
    shell.exec(`mkdir material`)
    shell.cd(`./material`);
    shell.exec("rm -rf .git");
    shell.exec("git init");
    shell.exec(`git remote add origin ${MATERIAL_URL}`); // 物料仓库
    shell.exec("git config core.sparseCheckout true");
    // 更新物料库下material的页面
    const filePath = `packages/${deviceType}/src/${componentType}/${componentName}`
    shell.exec(
      `echo 'packages/${deviceType}/src/${componentType}/${componentName}/*' >> .git/info/sparse-checkout`
    );
    shell.exec("git pull origin master");
    shell.cd('../')
    shell.exec(
      `cp -r material/${filePath} ${pwd}/src/${componentType}/${componentName}`
    );
    shell.exec('rm -r material');
    console.log('添加成功 ☕️！！！')
  });

// 此行内容落下会使命令行监听失效
commander.parse(process.argv);
