const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../config/config.env.development` });
const connectDB = require('./../../config/dbConnect');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

const start = async () => {
  try {
    await connectDB();
    console.log('Connected to DB.');

    // Read JSON file
    const toursData = JSON.parse(
      fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'),
    );
    const usersData = JSON.parse(
      fs.readFileSync(`${__dirname}/users.json`, 'utf-8'),
    );
    const reviewsData = JSON.parse(
      fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
    );

    // Import data
    const importData = async () => {
      try {
        await Tour.create(toursData);
        await User.create(usersData, { validateBeforeSave: false });
        await Review.create(reviewsData);
        console.log('Data successfully imported!');
        process.exit(0);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    };

    // Delete data
    const deleteData = async () => {
      try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!');
        process.exit(0);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    };

    // Evaluate CLI command
    if (process.argv[2] === '--import') {
      importData();
    } else if (process.argv[2] === '--delete') {
      deleteData();
    } else {
      console.log('Please specify --import or --delete');
      process.exit(0);
    }
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
};

start();
