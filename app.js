const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// GLOBAL MIDDLEWARE
//Set security HTTP headers
app.use(helmet());

//Cors
app.use(
  cors({
    origin: 'http://localhost:5173', // React/Vite Beispiel
    credentials: true,
  }),
);

app.options('*', cors());

//Dev logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Body parser
app.use(express.json({ limit: '10kb' }));

//Cookie parser
app.use(cookieParser());

//Data sanitization (after reading req.body) against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  }),
);

//Serving static files
app.use(express.static(`${__dirname}/public`));

//Limit requiests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again later!',
});
app.use('/api', limiter);

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});

// ROUTES

//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.post('/api/v1/tours', createTour);
//app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on the server.`,
  }); */
  /* 
  const err = new Error(`Can't find ${req.originalUrl} on the server.`);
  err.statusCode = 404;
  err.status = 'fail'; */
  next(new AppError(`Can't find ${req.originalUrl} on the server.`, 404));
});

app.use(globalErrorHandler);

// SERVER
module.exports = app;
