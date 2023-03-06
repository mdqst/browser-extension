/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { join, resolve } = require('path');

const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProgressPlugin, ProvidePlugin } = require('webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const allowList = require('./static/allowlist.json');
const manifest = require('./static/manifest.json');
const manifestFilePath = resolve(__dirname, './build/manifest.json');

const manifestOverride = manifest;
manifestOverride.content_security_policy.extension_pages = `${
  manifestOverride.content_security_policy.extension_pages
} ${allowList.urls.join(' ')};`;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    background: './src/entries/background/index.ts',
    contentscript: './src/entries/content/index.ts',
    popup: './src/entries/popup/index.ts',
    inpage: './src/entries/inpage/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(woff2|png|mp3)?$/,
        use: 'file-loader',
      },
      {
        test: /\.worker.js$/,
        loader: 'worker-loader',
      },
      {
        test: /\.vanilla\.css$/i, // Targets only CSS files generated by vanilla-extract
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              url: false, // Required as image imports should be handled via JS/TS import statements
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: false,
    }),
    new Dotenv({ allowEmptyValues: true }),
    new HtmlWebpackPlugin({
      chunks: ['popup'],
      template: './src/entries/popup/index.html',
      filename: 'popup.html',
    }),
    new CopyPlugin({
      patterns: [{ from: 'static', to: './' }],
    }),
    new MiniCssExtractPlugin(),
    new ProgressPlugin(),
    new VanillaExtractPlugin(),
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    // Custom plugin to apply the sandbox
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
          if (
            fs.writeFileSync(
              manifestFilePath,
              JSON.stringify(manifestOverride, null, 2),
            )
          ) {
            process.stdout.write('manifest overwritten successfuly');
          } else {
            process.stderr.write('manifest override failed');
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src/'),
      static: resolve(__dirname, 'static/'),
    },
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, 'build'),
    publicPath: '/',
  },
};
