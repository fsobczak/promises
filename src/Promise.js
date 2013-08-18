function Promise() {
  var identity = function(value) { return value; }
  var success = identity;
  var error = identity;
  var promise;

  this.resolve = function(status) {
    status = success(status);
    if (promise) { promise.resolve(status); }
  };
  this.reject = function(status) {
    error(status);
    if (promise) { promise.reject(status); }
  };
  this.then = function(scc, err) {
    success = scc || identity;
    error = err || identity;
    promise = new Promise();
    return promise;
  }
}

