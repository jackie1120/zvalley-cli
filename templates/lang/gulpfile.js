/*
 * @Author: Yu lin Liu
 * @Date: 2019-10-14 11:48:32
 * @Description: file content
 */
/**
 *  将中文json文件翻译为其他语言json文件
 *  支持语言：https://cloud.google.com/translate/docs/languages
 */
const gulp = require('gulp'),
  i18n = require('./i18n/config')
// 翻译文件的任务
gulp.task('default', done => {
  // 需要翻译的语种
  const languges = ['en']
  const length = languges.length
  for (let i = 0; i < length; i++) {
    gulp
      .src('./zh_CN/*.json')
      .pipe(
        // 翻译的具体逻辑
        i18n('', languges[i])
      )
      //  翻译之后的文件输出的文件路径
      .pipe(gulp.dest('./en_US/'))
    if (i === length - 1) {
      done()
    }
  }
})
