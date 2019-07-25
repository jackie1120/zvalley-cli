#!/usr/bin/env node

const templates = require(`${__dirname}/../template`)
const chalk = require('chalk')

for(let key in templates.list){
  let temp = templates.list[key]
  console.log(
	'  ' + chalk.green('★') +
	'  ' + chalk.green(temp.name) +
	' -' + temp.desc)
}
if(!templates.list || templates.list.length === 0){
  console.log(chalk.yellow('当前无可用模板'))
}

