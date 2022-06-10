const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebPackPlugin =  require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9999
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin(), 
    new FaviconsWebpackPlugin('./src/svg/taylor_bust_bowtie.svg'),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
       test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              '@babel/preset-env', 
              '@babel/preset-react',
              {
                'plugins': [
                  '@babel/plugin-proposal-class-properties'
                ]
              }
            ],
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.pdf$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
     ],
    },
};