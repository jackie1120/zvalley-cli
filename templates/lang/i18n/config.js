const { google } = require('translation.js')

var through = require('through2'),
  gutil = require('gulp-util'),
  PluginError = gutil.PluginError

// 常量
const PLUGIN_NAME = 'gulp-i18n'

/**
 * 转换json的语言
 * @param from 翻译源语言
 * @param to  译文语言
 * @returns {*}
 */
function i18n(from, to) {
  // 创建一个 stream 通道，以让每个文件通过
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit(
        'error',
        new PluginError(PLUGIN_NAME, 'Streams are not supported!')
      )
      return cb()
    }
    if (file.isBuffer()) {
      var json = JSON.parse(file.contents.toString())
      var tJson = ''
      //  获取json文件要翻译的数据
      for (var v in json) {
        if (json[v] instanceof Object) {
          tJson = getText(json[v], tJson)
        } else {
          tJson += json[v] + '\n'
        }
      }
      if (tJson.length > 2000)
        this.emit('error', new PluginError(PLUGIN_NAME, '源文件 大于 2000字'))
      //谷歌翻译
      google
        .translate({
          text: tJson,
          from: from,
          to: to
        })
        .then(result => {
          var content = file.contents
            .toString()
            .replace(/(:\s*")(\S+.*\S*)(")/gi, function(match, p1, p2, p3) {
              return p1 + result.result.splice(0, 1) + p3
            })
          if (result.result.length) {
            console.warn('中间有中文的标点符号', file)
          }
          file.contents = Buffer.from(content)
          // 确保文件进入下一个 gulp 插件
          this.push(file)
          // 告诉 stream 引擎，我们已经处理完了这个文件
          cb()
        })
    }
  })
  // 返回文件 stream
  return stream
}

/**
 * 获取要翻译的数据
 * @param src
 * @param dst
 * @returns {*}
 */
function getText(src, dst) {
  for (var k in src) {
    if (src[k] instanceof Object) {
      dst = getText(src[k], dst)
    } else {
      dst += src[k] + '\n'
    }
  }
  return dst
}

module.exports = i18n
