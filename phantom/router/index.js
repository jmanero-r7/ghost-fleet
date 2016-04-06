var Request = require('./request');
var Response = require('./response');
var Route = require('./route');
var Util = require('../util');

var Errors = require('../errors');

var METHODS = Util.METHODS;

/**
 * Minimal HTTP router for PhantomJS
 */
var Router = module.exports = function() {
  /**
   * Not called as constructor. Create a new handler
   */
  if (!(this instanceof Router)) {
    var router = new Router();

    function handler(req, res) {
      Request.create(req);
      Response.create(res);

      try {
        router.handle(req, res);
      } catch(e) {
        Errors.coerce(e);

        console.log(e.toString());
        res.status(e.code).json(e.toJSON())
      }
    };
    handler.router = router;

    // Attach route builders to returned handler
    handler.route = Router.prototype.route.bind(router);
    handler.use = Router.prototype.use.bind(router);
    METHODS.forEach(function(method) {
      method = method.toLowerCase();
      handler[method] = Router.prototype[method].bind(router);
    });

    return handler;
  }

  /**
   * Called as constructor. Instantiate Router object
   */
  this.layers = [];
  this.routes = [];
};

Router.prototype.handle = function(req, res) {
  Util.each(this.layers, function(layer, next) {
    layer(req, res, next);
  }, function(err) {
    if (!err) err = new Errors.NotFoundError(null, {
      method: req.method,
      path: req.path
    });

    res.status(err.code || 500);
    return res.json(err);
  });
};

Router.prototype.route = function(req, res, next) {
  for (var i = 0; i < this.routes.length; i++) {
    if (!this.routes[i].match(req)) continue;

    try {
      return this.routes[i].handle(req, res, next);
    } catch(err) {
      next(err);
    }
  }

  next();
}

Router.prototype.use = function(handler) {
  this.layers.push(handler);
};

/**
 * Builders
 */
METHODS.forEach(function(method) {
  method = method.toLowerCase();
  Router.prototype[method] = function(path) {
    var handlers = Array.apply(null, arguments).slice(1);

    this.routes.push(new Route(method, path, handlers));
    return this;
  };
});
