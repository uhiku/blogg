const express         = require('express');
const path            = require('path');
const exphbs          = require('express-handlebars');
const mongoose        = require('mongoose');
const methodOverride  = require('method-override');
const flash           = require('connect-flash');
const session         = require('express-session');
const bodyParser      = require('body-parser');
const passport        = require('passport');


const app = express();

app.use(express.static(path.join(__dirname, 'public')));
//routers
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

//connect to mongoose
mongoose.connect('mongodb://127.0.0.1:27018/blogg-dev', { 
	useNewUrlParser: true 
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));



//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//override methods
app.use(methodOverride('_method'));

//session middleware
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
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


app.use('/users', users);


app.use('/ideas', ideas);






const port = 5000;

app.listen(port, () => {
	console.log(`server started on port ${port}`)
});