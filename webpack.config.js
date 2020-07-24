const currentTask = process.env.npm_lifecycle_event; // either dev or build, the name of the two scipts
const path = require("path"); // don't have to install path. part of node library
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // for both dev and build task
const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("postcss-hexrgba"),
  require("autoprefixer")
];
// create our own plugins for images
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function() {
      // copy the original images file to the dist folder
      fse.copySync("./app/assets/images", "./docs/assets/images");
    });
  }
}

// work with multiple html files
const fse = require("fs-extra");
let cssConfig = {
  test: /\.css$/i, // only interested in the file named xx.css
  use: [
    "css-loader",
    { loader: "postcss-loader", options: { plugins: postCSSPlugins } }
  ]
};
// reture the array of all the files in the app folder but filter only the html file array
let pages = fse
  .readdirSync("./app")
  .filter(function(file) {
    return file.endsWith("html"); //.map means we want to use the HtmlWebpackPlugin for each html template
  })
  .map(function(page) {
    return new HtmlWebpackPlugin({
      // the generated file in the dist folder will be named after "page"
      filename: page,
      // the source file
      template: `./app/${page}`
    });
  });

// htmlwebpackplugin can genarate html file. and in that file, it automatically import
// js and css according to the chunkhash, so the html file can have the js and css effect

//config webpack differently depending on whether it is "dev" or "build"

// any config that will share between dev and build will be in the config object
// set up the unique config in the if statement
let config = {
  entry: "./app/assets/scripts/App.js", // the file you want to bundle
  // after we delete the script tag in html. we need this to let the html to recognise the file with the chunkhash
  plugins: pages,
  module: {
    rules: [
      // tell the webpack to do sth different depending on the file type
      cssConfig
    ]
  }
};

if (currentTask == "dev") {
  // add the style-loader to the cssConfig
  cssConfig.use.unshift("style-loader");
  config.output = {
    filename: "bundled.js", // the name of the bundled file
    path: path.resolve(__dirname, "app") // absolute path for the output, require node.js path package.
  };
  config.devServer = {
    before: function(app, server) {
      server._watch("./app/**/*.html"); // double * means any subfolder
    }, // watch the html file updates
    contentBase: path.join(__dirname, "app"), // point to the folder or dir we want the webpack to server
    hot: true, // allow the webpack to inject the new css and js into the browser on the fly
    port: 3000, // 8080 by default, 3000 easy to remember
    host: "0.0.0.0" // allow other devices on the same network to access the webpack dev server on this computer
  };
  config.mode = "development";
}

if (currentTask == "build") {
  // apply rules for js files
  config.module.rules.push({
    test: /\.js$/,
    // ignore the js file in the node module
    exclude: /(node_modules)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"]
      }
    }
  });

  // and the minicss to the build process, we have the loader and need to add the plugins
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  // add the cssnano package to compress the css file and reduce size
  postCSSPlugins.push(require("cssnano"));
  config.output = {
    // each file has the special name instead of just bundled.js
    // the chunkhash will change when the file changed, so the web browser can notice
    filename: "[name].[chunkhash].js", // the name of the bundled file
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "docs") // absolute path for the output, require node.js path package.
  };
  config.mode = "production";
  //
  config.optimization = {
    splitChunks: { chunks: "all" }
  };
  // when change happens, delete the previous file and remain the latest file with new chunkhash
  config.plugins.push(
    new CleanWebpackPlugin(),
    // extract the css file and name it with chunkhash
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
    // plugin for extracting images
    new RunAfterCompile()
  );
}

let deleteItLater = {
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

module.exports = config;
