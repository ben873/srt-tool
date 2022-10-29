const path = require('path');

module.exports = {
  "mode": "none",
  "entry": "./src/index.js",
  "output": {
    "path": __dirname + '/docs',
    "filename": "bundle.js"
  },
  devServer: {
    static: path.resolve(__dirname, 'docs'),
    port: 9000
  }
}
