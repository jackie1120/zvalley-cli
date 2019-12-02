/*
 * @Author: Yu lin Liu
 * @Date: 2019-10-14 11:48:32
 * @Description: file content
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { zh_CN, en_US } from './locate'

Vue.use(VueI18n)

const messages = {
  en_US: {
    ...en_US
  },
  zh_CN: {
    ...zh_CN
  }
}

const i18n = new VueI18n({
  locale: 'zh_CN',
  messages
})

export default i18n
