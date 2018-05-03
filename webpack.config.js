const path = require('path');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    entry: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
    output: {
        path: __dirname + '/public',
        publicPath: '/',
        filename: 'bundle.js'
    },
    watch: NODE_ENV === 'development',
    devServer: {
        hot: true,
        inline: true,
        port: 3000,
        contentBase: './public',
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env', 'react', 'stage-0'],
                            plugins: ['react-hot-loader/babel', 'transform-decorators-legacy']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin()
        // new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'inline-cheap-module-source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '*'],
        alias: {
            actions: path.resolve(__dirname, 'src/actions/'),
            reducers: path.resolve(__dirname, 'src/reducers/'),
            utils: path.resolve(__dirname, 'src/utils/')
        }
    }
};
