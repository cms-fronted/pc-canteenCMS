const plugins = ["@vue/babel-plugin-transform-vue-jsx"]
// 生产环境移除console
if (process.env.NODE_ENV === 'production') {
  plugins.push("transform-remove-console")
}

module.exports = {
  presets: [["@vue/app", { useBuiltIns: "entry" }]],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};
