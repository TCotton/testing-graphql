const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const graphql = require('graphql').graphql;
const graphQLHTTP = require('express-graphql');
const actionsSchema = require('./schema/actions');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

const query = 'query { actions { chanId } }';

graphql(actionsSchema, query).then(function(result) {
  console.dir(JSON.stringify(result));
});

app.use('/actions', graphQLHTTP({
  schema: actionsSchema,
  pretty: true,
  graphiql: true
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = http.createServer(app);

module.exports = server.listen(8080, (err) => {

  if (err) {
    return console.log('server error: ', err);
  }

  return console.log(`server is listening on 8080`);

});

module.exports = app;
