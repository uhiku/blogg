const express         = require('express');
const path            = require('path');
const exphbs          = require('express-handlebars');
const mongoose        = require('mongoose');
const methodOverride  = require('method-override');
const flash           = require('connect-flash');
const session         = require('express-session');
const bodyParser      = require('body-parser');
const passport        = require('passport');
const cookieParser    = require('cookie-parser');


const app = express();
app.use(express.static(path.join(__dirname, 'pub')));


//routers
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const auth  = require('./routes/auth');
const dash  = require('./routes/dashboard');
const pub   = require('./routes/public');
const profile   = require('./routes/profile');
const {
	truncate,
	stripTags,
	formatDate,
	publicToPrivate
} = require('./helpers/html')

//passport config
require('./config/passport')(passport);
const db = require('./config/database');

//connect to mongoose
mongoose.set('useFindAndModify', false); 
mongoose.connect('mongodb://127.0.0.1:27017/blogg-dev', { 
	useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));



//handlebars middleware
app.engine('handlebars', exphbs({
	helpers: {
		truncate: truncate,
		stripTags: stripTags,
		formatDate: formatDate,
		publicToPrivate: publicToPrivate
	},
	defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//override methods
app.use(methodOverride('_method'));

//session middleware
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//global variables
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user  = req.user || null;
	next();
})


//body parser middleware
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());



app.get('/', (req, res) => {
	const title = 'Welcome';
	res.render('index', {
		title: title
	});
});
app.get('/about', (req, res) => {
	const title = 'test2';
	res.render('about', {
		title: title
	});
});

//Load routes
app.use('/users', users);
app.use('/ideas', ideas);
app.use('/auth', auth);
app.use('/dashboard', dash);
app.use('/public', pub);
app.use('/profile', profile);
app.use(cookieParser());


const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`server started on port ${port}`)
});