if (process.env.NODE_ENV === 'production') {
	module.exports = {mongoURI: 'mongodb://ted:7576395hfcb@ds125723.mlab.com:25723/blogg_prod'}
} else {
	module.exports = {mongoURI: 'mongodb://127.0.0.1:27018/blogg-dev'}
}