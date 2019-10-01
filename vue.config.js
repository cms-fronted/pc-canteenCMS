module.exports = {
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/v1': {
        target: 'http://canteen.tonglingok.com/api',
        ws: true,
        changeOrigin: true
      },
    }
  }
}