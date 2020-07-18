const path = require("path"); // don't have to install path. part of node library
const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer")
];

module.exports = {
  // export this js file and use
  entry: "./app/assets/scripts/App.js", // the file you want to bundle
  output: {
    filename: "bundled.js", // the name of the bundled file
    path: path.resolve(__dirname, "app") // absolute path for the output, require node.js path package.
  },

  // webpack dev server
  devServer: {
    before: function(app, server) {
      server._watch("./app/**/*.html"); // double * means any subfolder
    }, // watch the html file updates
    contentBase: path.join(__dirname, "app"), // point to the folder or dir we want the webpack to server
    hot: true, // allow the webpack to inject the new css and js into the browser on the fly
    port: 3000, // 8080 by default, 3000 easy to remember
    host: "0.0.0.0" // allow other devices on the same network to access the webpack dev server on this computer
  },

  mode: "development",
  //webpack will stay running, watch and detect changes and renew the bundles the file. control + c to stop
  // if we use the devServer, we won't need the watch: true
  //watch: true,
  module: {
    rules: [
      // tell the webpack to do sth different depending on the file type
      {
        test: /\.css$/i, // only interested in the file named xx.css
        use: [
          "style-loader",
          "css-loader",
          { loader: "postcss-loader", options: { plugins: postCSSPlugins } }
        ]
      }
    ]
  }
};
