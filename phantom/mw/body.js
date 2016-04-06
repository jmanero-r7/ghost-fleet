
exports.json = function(options) {
  options = options || {};

  return (function json(req, res, next) {
    try {
      if (req.post instanceof Object) (req.body = req.post);
      else if (req.post) req.body = JSON.parse(req.post);
    } catch (err) {
      if (options.raiseErrors) return next(err);
    }

    next();
  });
};
