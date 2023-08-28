const express = require('express')
const app = express()
const cors = require('cors');
const fs = require('fs');
const Logger = require('bunyan-logger'); 

const operation = require('./connector');

// With options.
const bunyan = new Logger({
  name: 'myLog',
  stream: {
    name: 'file',
    path: './some.log'
  }
});

bunyan.info('logging')


// CORS
var corsOptions = {
  origin: process.env.HOSTNAME,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"]
}
app.use(cors(corsOptions));

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { log } = require('console');
const swaggerDocument = YAML.load('./documentation.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})

const myLogger = function (req, res, next) {
  console.log('LOGGEAD')
  bunyan.info('middlware')
  next()
}

app.use('/',myLogger);

app.use(express.static('public'))

function error(err, req, res, next) {
  // log it
  // if (!test) console.error(err.stack);

  // respond with 500 "Internal Server Error".
  console.log(err);
  // console.log(req);
  res.status(500);
  res.send('Internal Server Error');
}

app.get('/', async function (req, res) {
  // Caught and passed down to the errorHandler middleware
  // throw new Error('something broke!');
  const uplaodedImage = await operation.getAllUploadedImagesURL();
  log(uplaodedImage);
  res.status(200);
  res.send(uplaodedImage);
});

// app.get('/next', function(req, res, next){
//   // We can also pass exceptions to next()
//   // The reason for process.nextTick() is to show that
//   // next() can be called inside an async operation,
//   // in real life it can be a DB read or HTTP request.
//   process.nextTick(function(){
//     next(new Error('oh no!'));
//   });
// });

// the error handler is placed after routes
// if it were above it would not receive errors
// from app.get() etc
app.use(error);