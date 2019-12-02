let zh_CN = {}
let en_US = {}

const zhContext = require.context('./zh_CN', true, /\.json$/)

zhContext.keys().forEach(zh => {
  const zhModule = zhContext(zh)
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  zh_CN = { ...zh_CN, ...(zhModule.default || zhModule) }
})

const enContext = require.context('./en_US', true, /\.json$/)
enContext.keys().forEach(en => {
  const enModule = enContext(en)
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  en_US = { ...en_US, ...(enModule.default || enModule) }
})

export { zh_CN, en_US }
