// var webpack = require('webpack');

module.exports = {
    entry: './src/js/index.js',
    output: {
      filename: './js/bundle.js'
    },
    // devtool: 'inline-source-map', // write inline comment
    module: {
      loaders: [
    { test: /\.jsx$/, loader: 'jsx-loader' }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
    // ,
    // plugins: [
    //   new webpack.optimize.UglifyJsPlugin( {output: { comments: require('uglify-save-license')}})
    // ]
};
