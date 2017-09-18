const path = require('path');

module.exports = {
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  entry: [
    './src/ui/client.js',
  ],
  output: {
    path: path.resolve(__dirname, 'src/ui/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'less-loader',
        }],
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
    ],
  },
};
