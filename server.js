const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const connectDB = require('./config/dbConnect');

const port = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
};

startServer();
