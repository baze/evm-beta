let webpack = require('webpack');
let path = require('path');

let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ManifestPlugin = require('webpack-manifest-plugin');
// let HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlCriticalPlugin = require("html-critical-webpack-plugin");

let inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: {
        main: [
            './src/js/main.js',
            './src/sass/main.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/i,
                use: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[hash].[ext]'
                        }
                    },
                    'img-loader'
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].[chunkhash].css'),

        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        }),

        /*new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'views/index.twig',
            inject: true
        }),

        new HtmlCriticalPlugin({
            base: path.resolve(__dirname),
            src: 'dist/index.html',
            dest: 'views/base2.twig',
            inline: true,
            minify: true,
            extract: true,
            width: 375,
            height: 565,
            penthouse: {
                blockJSRequests: false,
            }
        }),*/

        new ManifestPlugin({
            fileName: 'manifest.json',
            basePath: 'dist/',
            seed: {
                name: 'My Manifest'
            }

        })
    ]
};

if (inProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    )
}