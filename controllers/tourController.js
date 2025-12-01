const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// TOURHANDLER FUNCTIONS
exports.getAllTours = async (req, res) => {
  try {
    //Build query

    //1. Filtering
    const { sort, page, limit, fields, ...filters } = req.query;

    //2. Advanced filtering
    let filterStr = JSON.stringify(filters);
    filterStr = filterStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const mongoFilter = JSON.parse(filterStr);

    let query = Tour.find(mongoFilter);

    //3. Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      //query = query.sort('-createdAt'); // default sorting
      query = query.sort('_id');
    }

    //4. Field limiting / projection
    if (fields) {
      const fieldsList = fields.split(',').join(' ');
      query = query.select(fieldsList);
    } else {
      query = query.select('-__v');
    }

    //5. Pagination
    const pageNum = parseInt(req.query.page, 10) || 1;
    const limitNum = parseInt(req.query.limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    query = query.skip(skip).limit(limitNum);
    if (page) {
      const docCount = await Tour.countDocuments(mongoFilter);
      if (skip >= docCount) {
        return res.status(404).json({
          status: 'fail',
          message: 'Page not exist',
        });
      }
    }

    //Execute query
    const tours = await query;

    //Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // it's Tour.findOne({ _id: req.params.id });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).send({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
