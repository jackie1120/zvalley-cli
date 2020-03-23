import Vue from 'vue'
import store from '../store'
import Hybrid from '@zvalley/hybrid-sdk'

// 绑定原生交互
export const hybrid = new Hybrid({
  baseColor: process.env.VUE_APP_BASE_COLOR
})
Vue.prototype.$h = hybrid

Vue.prototype.$storeUserInfo = userInfo => {
  let info = hybrid.getItem('UserInfo', true)
  info = JSON.parse(info)
  for (const key in info) {
    if (key in userInfo) {
      info[key] = userInfo[key]
    }
  }
  hybrid.setItem('UserInfo', JSON.stringify(userInfo))
}

// 获取数据字典
Vue.prototype.$getDataDic = key => {
  const dic = store.getters.dataDic
  let value
  // 如果key为空 则返回整个数据字典
  if (!key) {
    return dic
  }
  if (dic !== '') {
    value = dic[key]
  } else {
    console.error(`未在数据字典中找到${key}`)
    value = dic
  }

  return value
}

// 获取权限
Vue.prototype.$returnPermissions = functionCode => {
  if (functionCode && functionCode.length) {
    const userPermissions = store.getters.userPermissions
    return userPermissions.filter(x => x.code === functionCode).length > 0
  }
  return true
}