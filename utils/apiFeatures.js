class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const filters = { ...this.queryStr };

    delete filters.sort;
    delete filters.page;
    delete filters.limit;
    delete filters.fields;

    let filterStr = JSON.stringify(filters);
    filterStr = filterStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    const mongoFilter = JSON.parse(filterStr);
    this.query = this.query.find(mongoFilter);

    return this;
  }

  sort() {
    const { sort } = this.queryStr;
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //query = query.sort('-createdAt'); // default sorting
      this.query = this.query.sort('_id');
    }

    return this;
  }

  project() {
    const { fields } = this.queryStr;
    if (fields) {
      const fieldsList = fields.split(',').join(' ');
      this.query = this.query.select(fieldsList);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const pageNum = parseInt(this.queryStr.page, 10) || 1;
    const limitNum = parseInt(this.queryStr.limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;
    this.query = this.query.skip(skip).limit(limitNum);

    return this;
  }
}

module.exports = APIFeatures;
