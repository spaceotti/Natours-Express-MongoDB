const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARE
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware.');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
