const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const autoprefixer = require('autoprefixer');

function packageSort(packages) {
  return function sort(left, right) {
    const leftIndex = packages.indexOf(left.names[0]);
    const rightindex = packages.indexOf(right.names[0]);

    if (leftIndex < 0 || rightindex < 0) {
      throw 'unknown package';
    }

    if (leftIndex > rightindex) {
      return 1;
    }

    return -1;
  };
}

module.exports = {
  mode: 'production',
  entry: {
    main: './src/main.ts',
    polyfills: './src/polyfills.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack'
      },
      {
        test: /\.js$/,
        loader: '@angular-devkit/build-optimizer/webpack-loader',
        options: {
          sourceMap: false
        }
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => autoprefixer()
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                'primary-color': '#1DA57A',
                'link-color': '#1DA57A',
                'border-radius-base': '2px',
              },
              javascriptEnabled: true
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [new TerserPlugin({
      parallel: true
    })]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new AngularCompilerPlugin({
      tsConfigPath: path.resolve(__dirname, 'src/tsconfig.app.json'),
      entryModule: path.resolve(__dirname, 'src/app/app.module#AppModule'),
      sourceMap: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      chunksSortMode: packageSort(['polyfills', 'main'])
    })
  ]
};
