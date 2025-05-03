const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,      
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: 'file-loader',
        options: {
          name: './src/images/[name].[ext]'
        }
      }
    ],
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: '[name].css'
    // }),
    new ModuleFederationPlugin({
      name: 'vertical',
      filename: 'remoteEntry.js',
      exposes: {
        './About': './src/routes/About.jsx',
        './EditList': './src/routes/EditList.jsx',
        './FollowPage': './src/routes/FollowPage.jsx',
        './Home': './src/routes/Home.jsx',
        './ListPage': './src/routes/ListPage.jsx',
        './Lists': './src/routes/Lists.jsx',
        './Login': './src/routes/Login.jsx',
        './Profile': './src/routes/Profile.jsx',
        './Search': './src/routes/Search.jsx',
        './StatusPage': './src/routes/StatusPage.jsx',
        './TagPage': './src/routes/TagPage.jsx',
        './ThemeSwitchPage': './src/routes/ThemeSwitchPage.jsx',
        './Users': './src/routes/Users.jsx',
        './Vikalp': './src/routes/Vikalp.jsx',
        './UserContext': './src/context/UserContext.js',
        './ErrorContext': './src/context/ErrorContext.js',
        './LoginPage': './src/components/LoginPage.jsx'
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: '^18.3.1',
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^18.3.1',
        },
        'react-router-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^7.5.1',
        },
        'axios': {
          singleton: true,
          eager: true,
          requiredVersion: '^1.8.4',
        },
        'js-cookie': {
          singleton: true,
          eager: true,
          requiredVersion: '^3.0.5',
        },
        'luxon': {
          singleton: true,
          eager: true,
          requiredVersion: '^3.5.0',
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
  devServer: {
    port: 3002,
    historyApiFallback: true,
    hot: true,
  },
  // devServer: {
  //   port: 3002,
  //   historyApiFallback: {
  //     disableDotRule: true,
  //     index: '/index.html', // or your correct entrypoint
  //   },
  //   static: {
  //     directory: path.join(__dirname, 'dist'), // where your built files are
  //   },
  // },
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  output: {
    publicPath: 'http://localhost:3002/', // 👈 important for react-router
    filename: 'bundle.js',
    clean: true,
  },
};
