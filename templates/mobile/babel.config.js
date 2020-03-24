module.exports = {
    presets: ['@vue/app'],
    plugins: [
      [
        'import',
        {
          libraryName: '@zvalley/zv-ui',
          libraryDirectory: 'es',
          style: true
        },
        'zv-ui'
      ]
    ]
  }