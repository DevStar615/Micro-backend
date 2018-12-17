const cluster = require('cluster')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan');
const rfs = require('rotating-file-stream')
const {includeAllLogs} = require('./configs/general');

const creditRoute = require('./routes/creditParameters.route')
const customerRoute = require('./routes/customer.route')
const countryRoute = require('./routes/country.route');
const stateRoute = require('./routes/state.route');
const cityRoute = require('./routes/city.route');
const customerBalanceRoute = require('./routes/customerBalance.route');

const {db} = require('./configs/database.js');

const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger/swagger')

let logDirectory = path.join(__dirname, 'logs')

fs.existsSync(logDirectory || fs.mkdirSync(logDirectory))

let accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily you can also provide the file size limitation.
  path: logDirectory
});

let errorLogStream = rfs('error.log', {
  interval: '1d', // rotate daily you can also provide the file size limitation.
  path: logDirectory
});

let app = express();
app.use(cors());

const logFormatter = (tokens, req, res) => {
  let log = {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseLength: tokens.res(req, res, 'content-length'),
    responseTime: tokens['response-time'](req, res) + ' ms',
    remoteAddr: tokens['remote-addr'](req, res),
    remoteUser: tokens['remote-user'](req, res),
    requestHeaders: req["headers"],
    requestParams: req["params"],
    requestBody: req["body"]
  }
  return JSON.stringify(log);
}

if (includeAllLogs) {
  app.use(morgan(logFormatter, {stream: accessLogStream}))
}

app.use(morgan(logFormatter, {
  skip: function (req, res) {
    return res.statusCode < 400
  },
  stream: errorLogStream
}));

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/credits',creditRoute)
app.use('/customers',customerRoute)
app.use('/country', countryRoute);
app.use('/state', stateRoute);
app.use('/city', cityRoute);
app.use('/customerBalance', customerBalanceRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    detail: err
  });
});

if (cluster.isMaster) {
  cluster.fork();
  cluster.on('exit', (worker) => {
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

  });
}
else {
  app.get('/', (request, response) => {
    console.log('Request to worker %d', cluster.worker.id);
    response.send('Hello from Worker ' + cluster.worker.id);
  });
  app.listen(3005);
  console.log('Worker %d running!', cluster.worker.id);
}