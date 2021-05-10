const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");

// const demosDirPath = path.resolve(__dirname, "../src/demos");
// const demos = fs.readdirSync(demosDirPath);

// const demosEntry = {};
// for (const demo of demos) {
//   const indexJS = path.resolve(__dirname, `../src/demos/${demo}/index.js`);
//   if (fs.existsSync(indexJS)) {
//     demosEntry[`index-${demo}`] = indexJS;
//   } else {
//     const indexTS = path.resolve(__dirname, `../src/demos/${demo}/index.ts`);
//     demosEntry[`index-${demo}`] = indexTS;
//   }
// }

const htmlWebpackPluginMinifyConfig = {
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,

  collapseWhitespace: true,
  useShortDoctype: true, // 使用短的文档声明
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};

module.exports = {
  mode: "production",
  entry: {
    index: path.join(__dirname, "..", "src/index.ts"),
    //...demosEntry,
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name]/[hash].js",
    publicPath: "/", // 所有输出资源在引入时的公共路径(loader,plugin引入时以此路径为基准), 若loader中也指定了publicPath, 会以loader的为准,
    assetModuleFilename: "data/[name].[ext]",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        // css
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // 取代style-loader,
          //'style-loader',  // 将css文件注入到DOM, 默认通过为html添加style标签的方式
          "css-loader", // 解析css文件中的@import和url(), 就像js文件中的import/require一样.
          {
            loader: "postcss-loader", // 将css转换成适配各种浏览器的版本
            options: {
              // ident: 'postcss',
              // plugins: () => [
              //   require('postcss-preset-env')()
              // ]
              postcssOptions: {
                plugins: [
                  require("postcss-flexbugs-fixes"),
                  require("postcss-preset-env")({
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  }),
                  require("postcss-normalize"),
                ],
              },
            },
          },
        ],
      },
      {
        // 使得import/require可以导入相应后缀的文件, 转化成url.
        test: /\.(csv)$/i,
        loader: "file-loader", //  resolves import/require() on a file into a url and emits the file into the output directory.
        options: {
          outputPath: "data",
        },
      },
      {
        // 打包直接放在文件夹中, 被js引用的图片 asset files(fonts, icons, etc)
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset", // https://webpack.js.org/guides/asset-modules/
      },
      {
        // 处理html中的img标签
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        // 语法检查
        test: /\.(j|t)s$/,
        exclude: /node_modules/,
        enforce: "pre", // 提前加载
        loader: "eslint-loader",
        // options: {
        //   // eslint options (if necessary)
        // },
      },
      {
        // es6 -> es5
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage", // 按需引入,需要使用polyfill
                  corejs: { version: 3 }, // 解决warn
                  targets: {
                    // 指定兼容性处理哪些浏览器
                    chrome: "58",
                    ie: "9",
                  },
                },
              ],
            ],
            cacheDirectory: true, // 开启babel缓存
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
      title: "index",
      inject: "body",
      minify: htmlWebpackPluginMinifyConfig,
      cache: true,
      chunks: ["index"],
    }),
    // ...demos.map(
    //   (demo) =>
    //     new HtmlWebpackPlugin({
    //       filename: `demos/${demo}/index.html`,
    //       template: `src/demos/${demo}/index.html`,
    //       title: "index",
    //       inject: "body",
    //       minify: htmlWebpackPluginMinifyConfig,
    //       cache: true,
    //       chunks: [`index-${demo}`],
    //     })
    // ),
    new MiniCssExtractPlugin({
      // 将样式文件合并成名为main的样式文件
      filename: "css/[name].css",
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js','.csv']
  }
};
