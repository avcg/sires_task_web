module.exports = {
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#4d7cfe',
          'link-color': '#4d7cfe',
        },
        javascriptEnabled: true,
      },
      sass: {
        data: '@import "@/assets/styles/variables.sass";',
      },
    },
  },
};
