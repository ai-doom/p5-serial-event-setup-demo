const path = require("path");


const 
    DIST_DIR   = path.resolve(__dirname, "static"),
    SRC_DIR = path.resolve(__dirname, "src");

module.exports = {
    context: SRC_DIR,

    entry: "./index",

    output: {
        path:     DIST_DIR,
        filename: "main.js"
    },

    resolve: {
        extensions: ['.less', '.js']
    },

    devtool: 'source-map',
    devServer: {
        publicPath: DIST_DIR
    },

    // module: {
    //   rules: [{
    //     test: /.jsx?$/,
    //     include: [
    //       path.resolve(__dirname, 'src')
    //     ],
    //     exclude: [
    //       path.resolve(__dirname, 'node_modules'),
    //       path.resolve(__dirname, 'bower_components')
    //     ],
    //     loader: 'babel-loader',
    //     query: {
    //       presets: ['es2015']
    //     }
    //   }]
    // },

};

