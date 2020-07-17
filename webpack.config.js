const path = require("path"); // don't have to install path. part of node library

module.exports = {
  // export this js file and use
  entry: "./app/assets/scripts/App.js", // the file you want to bundle
  output: {
    filename: "bundled.js", // the name of the bundled file
    path: path.resolve(__dirname, "app") // absolute path for the output, require node.js path package.
  },
  mode: "development",
  watch: true //webpack will stay running, watch and detect changes
};
