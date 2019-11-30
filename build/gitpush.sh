#!/usr/bin/env sh
set -e
echo "请输入远程仓库地址: "
read GITPSTH

read -p "远程仓库地址为 $GITPSTH - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  # 通过命令把这个目录变成git可以管理的仓库
  git init
 
  #把文件添加到版本库中，使用命令 git add .添加到暂存区里面去。不要忘记后面的小数点“.”，意为添加文件夹下的所有文件
  git add .
  
  # 用命令告诉Git，把文件提交到仓库。引号内为提交说明
  git commit -m 'first commit'

  # 关联到你的远程库地址 
  git remote add origin $GITPSTH

  # 获取远程库与本地同步合并（如果远程库不为空必须做这一步，否则后面的提交会失败）
  git pull --rebase origin master

  # 把本地库的内容推送到远程，用 git push命令，实际是把当前分支master推送到远程。
  # 执行此命令后会要求输入用户名、密码，验证通过后即开始上传。
  git push -u origin master
fi