import Vue from 'vue'
import { Button } from '@zvalley/zv-ui'

// 注入再这个Array中添加对应的就行
const componentsList = [Button]

componentsList.reduce((preComponent, currentComponnets) => {
  preComponent.use(currentComponnets)
  return preComponent
}, Vue)
