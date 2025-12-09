const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    );

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = connectDB;
