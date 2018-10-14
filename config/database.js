if (process.env.NODE_ENV === 'production') {
	module.exports = {mongoURI: 'mongodb://ted:7576395hfcb@ds125723.mlab.com:25723/blogg_prod'}
} else {
	module.exports = {mongoURI: 'mongodb://127.0.0.1:27018/blogg-dev'}
}
if (process.env.NODE_ENV === 'production') {
	module.exports = {callbackURL: 'https://frozen-depths-71061.herokuapp.com/auth/google/callback'}
} else {
	module.exports = {callbackURL: 'http://localhost.ua:5000/auth/google/callback'}
}