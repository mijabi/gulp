// var webpack = require('webpack');

module.exports = {
    entry: './src/js/index.js',
    output: {
      filename: './js/bundle.js'
    },
    // devtool: 'inline-source-map', // write inline comment
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /(node_modules)/,
          query: {
            presets: ['es2015']
            // presets: ['react', 'es2015']
          }
        }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
      alias: {
        NODE_MODULES : '../../node_modules',
        LIB          : './lib',
        CLASSES      : './_classes'
      }
    }
    // ,
    // plugins: [
    //   new webpack.optimize.UglifyJsPlugin( {output: { comments: require('uglify-save-license')}})
    // ]
};
