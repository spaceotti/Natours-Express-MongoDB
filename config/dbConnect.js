const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(DB);
    //console.log(connection.connections);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
