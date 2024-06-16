const path = require("path");

module.exports = {
  // Entry point of your application
  entry: "./app.js",

  // Output configuration for Webpack
  output: {
    path: path.resolve(__dirname, "dist"), // The output directory
    filename: "app.js", // The name of the output file
  },

  // Set the mode to 'development' or 'production'
  mode: "production",

  // Configuration for modules
  module: {
    rules: [
      {
        test: /\.js$/, // Regex for JavaScript files
        exclude: /node_modules/, // Exclude the node_modules directory
        use: {
          loader: "babel-loader", // Use babel-loader for transpiling JavaScript
          options: {
            presets: ["@babel/preset-env"], // Use the env preset
          },
        },
      },
      {
        test: /\.css$/, // Regex for CSS files
        use: ["style-loader", "css-loader"], // Use these loaders for CSS files
      },
      // Add more rules for other file types (e.g., images, fonts)
    ],
  },

  // Plugins (if any)
  plugins: [
    // Add any plugins you need here
  ],
};
