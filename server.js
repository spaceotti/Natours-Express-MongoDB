const dotenv = require('dotenv');

// NODE_ENV evtl. noch nicht gesetzt → default: development
const env = process.env.NODE_ENV || 'development';

// 🔥 Dynamisch die richtige env-Datei laden
dotenv.config({ path: `./config/config.env.${env}` });

console.log('Loaded env file:', `config.env.${env}`);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = require('./app');
const connectDB = require('./config/dbConnect');

const port = process.env.PORT || 3000;

let server;

// START SERVER
const startServer = async () => {
  try {
    console.log('NODE_ENV at start:', process.env.NODE_ENV);

    await connectDB();
    console.log('Connected to MongoDB');

    server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port} (${env})`);
    });
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
};

//UNHANDLED REJECTIONS
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

//UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Start
startServer();
