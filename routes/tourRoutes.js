const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('./../controllers/tourController');
const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router();
//router.param('id', checkId);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);

//Public routes
router.route('/').get(getAllTours);
router.route('/:id').get(getTour);

//Protected routes
router.use(protect);

router
  .route('/monthly-plan/:year')
  .get(restrictTo('admin', 'lead-guide'), getMonthlyPlan);

router.route('/').post(restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .patch(restrictTo('admin', 'lead-guide'), updateTour)
  .delete(restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
