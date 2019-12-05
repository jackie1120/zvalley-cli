#!/usr/bin/env node

const clone = require('git-clone-promise')
const program = require('commander')
const shell = require('shelljs')
const path = require('path')

program
  .command('create [projectName]') // 命名命令，可选参数projecName,传入action函数第一个参数
  .alias('c') // 命令简写
  .description('构建前端模板项目')
  .option('-t, --type [type]', '选择模板类型 web/mobile/simple', /^(web|mobile|simple)$/i, 'simple') // 可选参数，key值为type，只能传入指定值，默认'mobile'
  .action(function (projectName = 'web-template', options) { // 执行命令的的函数
	let pwd = shell.pwd()
	let localpath = path.join(pwd.toString(), projectName)
	const { type } = options
	const url = 'https://github.com/122687220/web-template.git'
	let params = {}
	if (type === 'mobile') {
	  params = { checkout: '移动端' }
	} else if (type === 'web') {
	  params = { checkout: 'PC端' }
	}
	clone(url, localpath, params).then(res => {
	  shell.rm('-rf', path.join(localpath, '.git'))
	  console.log('模板工程建立完成')
	})
  })
  .on('--help', () => {
	logger.log('Example:')
	logger.log('  创建一个默认的项目')
	logger.log('     $ zvalley create  或者 $ zvalley c')
	logger.log('  创建指定平台(web/mobile/simple) 指定项目名的项目')
	logger.log('     $ zvalley create testname -t web \n')
  })

program.parse(process.argv)

// const memFs = require('mem-fs');
// const memFsEditor = require('mem-fs-editor');

// const store = memFs.create();
// const fs = memFsEditor.create(store);