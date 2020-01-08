const path = require('path');


// development or production
const mode = 'production';

module.exports = {
    entry: {
        cssanimator: './src/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: mode === 'production' ? 'hidden-source-map' : 'inline-source-map',
    devServer: {
        contentBase: './dist',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: [
                    '/node_modules/'
                ]
            }
        ]
    },
    plugins: []
};
