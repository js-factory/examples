const path = require('path');
const PfBudgetPlugin = require('@js-factory/perf-budget-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './example.js',
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader?-removeOptionalTags'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'template.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new PfBudgetPlugin({
            main: {
                js: 1100,
                css: 50
            }
        })
    ]
};