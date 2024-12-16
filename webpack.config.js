const path = require('path');

module.exports = {
  devServer: {
    headers: {
      
      'Content-Type': 'application/javascript',
    },
    static: {
      
      directory: path.join(__dirname, 'public'),
    },
  },
};
