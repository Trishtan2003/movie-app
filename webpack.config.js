const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/service-worker.js', to: 'service-worker.js' },
      ],
    }),
  ],
  devServer: {
    headers: {
      'Content-Type': 'application/javascript',
    },
    static: {
      directory: path.join(__dirname, 'public'), 
    },
  },
};
