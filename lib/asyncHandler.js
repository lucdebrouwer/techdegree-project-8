/* This wrapper was part of the async express course on Treehouse,
which taught us how to refactor our code into manageable parts */

// The handler accepts a callback function and executes this callback asynchronously
// If an error occurs, for now it will return a 400 error.
module.exports = function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
