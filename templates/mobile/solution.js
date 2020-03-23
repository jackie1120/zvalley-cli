/*
 * @Author: Yu lin Liu
 * @Date: 2019-08-22 09:21:27
 * @Description: file content
 */
const userAgent = navigator.userAgent.toLowerCase()
/** 2019/2/17
 * @Author: 刘宇琳
 * @Desc: 解决 微信打开网页键盘弹起后页面上滑，导致弹框里的按钮响应区域错位
 */
//判断是否微信浏览器
if (userAgent.indexOf('micromessenger') > -1) {
  ;/iphone|ipod|ipad/i.test(navigator.appVersion) &&
    document.addEventListener(
      'blur',
      e => {
        // 这里加了个类型判断，因为a等元素也会触发blur事件
        ;['input', 'textarea'].includes(e.target.localName) && document.body.scrollIntoView(false)
      },
      true
    )
}

/** 2019/2/17
 * @Author: 刘宇琳
 * @Desc: 解决ios10及以上Safari无法禁止缩放的问题
 */
//判断是否Safari浏览器
if (userAgent.indexOf('safari') > -1) {
  window.onload = function() {
    document.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    })
    var lastTouchEnd = 0
    document.addEventListener(
      'touchend',
      function(event) {
        var now = new Date().getTime()
        if (now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now
      },
      false
    )
    document.addEventListener('gesturestart', function(event) {
      event.preventDefault()
    })
  }
}
