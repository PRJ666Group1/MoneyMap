const rules = require('./webpack.rules');
const path = require("path");

// Add rule for SVG files
rules.push({
  test: /\.svg$/,
  use: ['file-loader'],  // This will handle SVG files and copy them to your build folder
});

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,  // Apply all the rules
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.svg'],  // Ensure SVG files are resolved
  },
};
