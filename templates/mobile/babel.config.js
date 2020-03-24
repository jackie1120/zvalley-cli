module.exports = {
    presets: ['@vue/app'],
    plugins: [
      [
        'import',
        {
          libraryName: '@zvalley/zv-ui',
          libraryDirectory: 'es',
          style: name => `${name}/style/scss`
        },
        'zv-ui'
      ]
    ]
  }