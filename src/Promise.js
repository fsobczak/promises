function Promise() {
  var success = function() {};
  var error, promise;

  this.resolve = function(status) {
    status = success(status);
    if (promise) { promise.resolve(status); }
  };
  this.reject = function(status) {
    if (error) { error(status);}
    if (promise) { promise.reject(status); }
  };
  this.then = function(scc, err) {
    success = scc;
    error = err;
    promise = new Promise();
    return promise;
  }
}

