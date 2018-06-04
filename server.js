const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const async = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session'); // in memroy store
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');



const app = express();

// middle-wares
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(session({
  resave: true,
  saveUinitialiazed: true,
  secret: "taha_123",
  store: new MongoStore({ url: 'mongodb://TaHa:T25897/@ds147420.mlab.com:47420/mail_chimp_subscriper'})
}));
app.use(flash());

app.route('/')
  .get((req, res, next) => {
    res.render('main/home', { message: req.flash('success') });
  })
  .post((req, res, next) => {
    request({
      url: 'https://us18.api.mailchimp.com/3.0/lists/57bc04eec7/members',
      method: 'POST',
      headers: {
        'Authorization': 'randomUser a0c422ea68c053fff3b069855aaaf939-us18',
        'Content-Type': 'application/json'
      },
      json: {
        'email_address': req.body.email, // this email as key from the form in bootstrap
        'status': 'subscribed' // that is required by mail chimp
      }
    }, function(err, response, body) {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'You have submitted your email');
        res.redirect('/');
      }
    });
  });

// Session = memory store, if you want to perserve the data for future use
// Data Store = mongodb, redis

app.listen(3030, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Running on Port 3030");
  }
});
