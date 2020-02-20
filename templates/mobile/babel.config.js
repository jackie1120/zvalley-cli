module.exports = {
    presets: ['@vue/app'],
    plugins: [
      [
        'import',
        {
          libraryName: 'vant',
          libraryDirectory: 'es',
          style: name => `${name}/style/less`
        },
        'vant'
      ],
      // [
      //   'import',
      //   {
      //     libraryName: '@zvalley/zv-ui',
      //     libraryDirectory: 'packages',
      //     style: name => {
      //       const newName = name.replace('packages', 'packages/theme-chalk/lib')
      //       return `${newName}.vw.css`
      //     }
      //   },
      //   'zv-ui'
      // ]
    ]
  }