var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path')

var NODE_ENV = process.env.NODE_ENV

console.log("NODE_ENV === ", NODE_ENV)

var conf = {
	debug: NODE_ENV !== 'production',
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, './dist/www'),
		publicPath : '/',
		filename : 'js/time.[hash].js'
	},
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
	plugins: [
	    new CopyWebpackPlugin([{ from: './src/vendor', to: 'vendor'}]),
	    new CopyWebpackPlugin([{ from: './src/img', to: 'img'}]),
		new HtmlWebpackPlugin({template : './src/index.html',inject : 'body',hash : 'true'})
	],
    devServer: {
        port: 7072,
        proxy: {
            '/api/*': { target: 'http://localhost:8080' }
        },
    }
};

if(NODE_ENV === 'production'){
    conf.plugins.push(new CopyWebpackPlugin([
        {from: 'nginx/mime.types', to: '../nginx'},
        {from: 'nginx/nginx.conf', to: '../nginx'}
    ]))
}


module.exports = conf