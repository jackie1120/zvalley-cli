import client from 'webpack-theme-color-replacer/client'

export let curColor = '#7cb342'

// 动态切换主题色
export function changeThemeColor(newColor) {
  var options = {
    newColors: [newColor]
  }
  return client.changer.changeColor(options, Promise).then(() => {
    curColor = newColor
    localStorage.setItem('theme_color', curColor)
  })
}

export function initThemeColor() {
  const savedColor = localStorage.getItem('theme_color')
  if (savedColor) {
    curColor = savedColor
    changeThemeColor(savedColor)
  }
}