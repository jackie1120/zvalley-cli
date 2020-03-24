import Vue from 'vue'
import { Button, Select } from 'element-ui'

const componentsList = [Button, Select];

componentsList.forEach(item => {
  Vue.component(item.name, item)
})