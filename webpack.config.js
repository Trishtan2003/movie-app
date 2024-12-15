const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/service-worker.js', to: 'service-worker.js' }, 
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    headers: {
      'Content-Type': 'application/javascript', 
    },
  },
};
