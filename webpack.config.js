const path = require('path'); // Add this line to resolve the 'path' error

module.exports = {
  entry: './src/index.js', // Adjust the path to your entry file if needed
  output: {
    path: path.resolve(__dirname, 'build'), // Use the path module here
    filename: 'bundle.js',
    publicPath: '/',
  },
  mode: 'development', // Or 'production'
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve files from public folder
    },
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
};
