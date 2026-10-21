const mongoose = require('mongoose');
const Loc = mongoose.model('Location');


const doSetAverageRating = async (location) => {
  if (location.reviews && location.reviews.length > 0) {
    const count = location.reviews.length;

    const total = location.reviews.reduce((acc, { rating }) => {
      return acc + rating;
    }, 0);

    location.rating = parseInt(total / count, 10);

    try {
      await location.save();

      console.log(
        `Average rating updated to ${location.rating}`
      );
    } catch (err) {
      console.log(err);
    }
  }
};


const updateAverageRating = async (locationid) => {
  try {
    const location = await Loc
      .findById(locationid)
      .select('rating reviews')
      .exec();

    if (location) {
      await doSetAverageRating(location);
    }
  } catch (err) {
    console.log(err);
  }
};


const doAddReview = async (req, res, location) => {
  if (!location) {
    return res
      .status(404)
      .json({
        message: 'Location not found'
      });
  }

  const {
    author,
    rating,
    reviewText
  } = req.body;

  location.reviews.push({
    author,
    rating,
    reviewText
  });

  try {
    await location.save();

    updateAverageRating(location._id);

    const thisReview =
      location.reviews[location.reviews.length - 1];

    return res
      .status(201)
      .json(thisReview);

  } catch (err) {

    console.log(err);

    return res
      .status(400)
      .json(err);
  }
};


const reviewsCreate = async (req, res) => {
  const locationid = req.params.locationid;

  if (!locationid) {
    return res
      .status(404)
      .json({
        message: 'Location not found'
      });
  }

  try {
    const location = await Loc
      .findById(locationid)
      .select('reviews')
      .exec();

    if (!location) {
      return res
        .status(404)
        .json({
          message: 'Location not found'
        });
    }

    return doAddReview(req, res, location);

  } catch (err) {

    return res
      .status(400)
      .json(err);
  }
};


const reviewsReadOne = async (req, res) => {
  if (
    !req.params.locationid ||
    !req.params.reviewid
  ) {
    return res
      .status(404)
      .json({
        message:
          'Not found, locationid and reviewid are both required'
      });
  }

  try {
    const location = await Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec();

    if (!location) {
      return res
        .status(404)
        .json({
          message: 'Location not found'
        });
    }

    if (
      location.reviews &&
      location.reviews.length > 0
    ) {
      const review =
        location.reviews.id(req.params.reviewid);

      if (!review) {
        return res
          .status(404)
          .json({
            message: 'Review not found'
          });
      }

      const response = {
        location: {
          name: location.name,
          id: req.params.locationid
        },
        review
      };

      return res
        .status(200)
        .json(response);

    } else {

      return res
        .status(404)
        .json({
          message: 'No reviews found'
        });
    }

  } catch (err) {

    return res
      .status(400)
      .json(err);
  }
};


const reviewsUpdateOne = async (req, res) => {
  if (
    !req.params.locationid ||
    !req.params.reviewid
  ) {
    return res
      .status(404)
      .json({
        message:
          'Not found, locationid and reviewid are both required'
      });
  }

  try {
    const location = await Loc
      .findById(req.params.locationid)
      .select('reviews')
      .exec();

    if (!location) {
      return res
        .status(404)
        .json({
          message: 'Location not found'
        });
    }

    if (
      location.reviews &&
      location.reviews.length > 0
    ) {
      const thisReview =
        location.reviews.id(req.params.reviewid);

      if (!thisReview) {
        return res
          .status(404)
          .json({
            message: 'Review not found'
          });
      }

      thisReview.author = req.body.author;
      thisReview.rating = req.body.rating;
      thisReview.reviewText = req.body.reviewText;

      await location.save();

      updateAverageRating(location._id);

      return res
        .status(200)
        .json(thisReview);

    } else {

      return res
        .status(404)
        .json({
          message: 'No review to update'
        });
    }

  } catch (err) {

    return res
      .status(404)
      .json(err);
  }
};


const reviewsDeleteOne = async (req, res) => {
  if (
    !req.params.locationid ||
    !req.params.reviewid
  ) {
    return res
      .status(404)
      .json({
        message:
          'Not found, locationid and reviewid are both required'
      });
  }

  try {
    const location = await Loc
      .findById(req.params.locationid)
      .select('reviews')
      .exec();

    if (!location) {
      return res
        .status(404)
        .json({
          message: 'Location not found'
        });
    }

    if (
      location.reviews &&
      location.reviews.length > 0
    ) {
      const review =
        location.reviews.id(req.params.reviewid);

      if (!review) {
        return res
          .status(404)
          .json({
            message: 'Review not found'
          });
      }

      location.reviews.pull(req.params.reviewid);

      await location.save();

      updateAverageRating(location._id);

      return res
        .status(204)
        .json(null);

    } else {

      return res
        .status(404)
        .json({
          message: 'No review to delete'
        });
    }

  } catch (err) {

    return res
      .status(404)
      .json(err);
  }
};


module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};