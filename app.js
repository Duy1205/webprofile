let express         = require('express');
let mongoose        = require('mongoose');
let bodyParser      = require('body-parser');
let app             = express();
let moment          = require('moment');
let expressSession  = require('express-session');
let cookieParser    = require('cookie-parser');
let ROLE_ADMIN       = require('./utils/checkRole');

//ROUTE
const TOPIC_ROUTE = require('./routes/topic');
const POST_ROUTE = require('./routes/post');
const COMMENT_ROUTE = require('./routes/comment');
const USER_ROUTE = require('./routes/user');
const IMG_ROUTE = require('./routes/img');
//ChildRouting
const {renderToView} = require('./utils/childRouting');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.set('view engine','ejs');
app.set('views', './views/');
app.use(cookieParser());

app.use(expressSession({
    secret: 'webTinTuc',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 10 * 60 * 1000 * 20
    }
}))

app.use('/topics', TOPIC_ROUTE);
app.use('/posts', POST_ROUTE);
app.use('/comments', COMMENT_ROUTE);
app.use('/users', USER_ROUTE);
app.use('/imgs', IMG_ROUTE);


app.get('/', async (req, res) => {
    renderToView(req, res, 'pages/login', {});
})

app.get('/home', async (req, res) => {
    renderToView(req, res, 'pages/home', {});
})

app.get('/dashboard', async (req, res) => {
    renderToView(req, res, 'pages/dashboard', {});
})

app.get('/listTable', (req, res) => {
    renderToView(req, res, 'pages/listTable', {});
});

app.get('/listPost', (req, res) => {
    renderToView(req, res, 'pages/listPost', {});
});

app.get('/listUser', (req, res) => {
    renderToView(req, res, 'pages/listUser', {});
});

app.get('/date', (req, res) => {
    renderToView(req, res, 'pages/date', {});
})

let uri     = 'mongodb://localhost:27017/webprofile';
const PORT  = process.env.PORT || 3000;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
console.log(`mongodb connected`);
app.listen(PORT,() => console.log(`sever connected at port ${PORT}`)
)
})