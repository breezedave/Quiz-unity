const webpack = require("webpack");
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = {
    mode: "production",
    entry: [
        path.resolve(__dirname,'src/fe/client.js'),
    ],
    output: {
        filename: "./fe/client.js"
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
    },
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: 'fe/public',
                            outputPath: 'fe/public',
                        },
                    },
                ],
            },
        ],
    },
    devtool: false,
    resolve: {
        modules: ['node_modules'],
        extensions: [".js"],
        alias: {
            fe: path.resolve(__dirname, "src/fe"),
            be: path.resolve(__dirname, "src/be"),
            content: path.resolve(__dirname, "src/content"),
        }
    },
    plugins: [
        new HtmlWebPackPlugin({
            inject: false,
            template: "./src/fe/client.html",
            filename: "./fe/client.html",
        }),
        new webpack.SourceMapDevToolPlugin({}),
    ],
};
