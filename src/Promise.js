function Promise() {
  var identity = function(value) { return value; }
  var success = identity;
  var error = identity;
  var rejectStatus = null;
  var resolveStatus = null;
  var promise;

  function process() {
    if (rejectStatus) {
      status = error(rejectStatus);
      if (promise) { promise.reject(status); }
    }
    if (resolveStatus) {
      status = success(resolveStatus);
      if (promise) { promise.resolve(status); }
    }
  }

  this.resolve = function(status) {
    resolveStatus = status;
    process();
  };
  this.reject = function(status) {
    rejectStatus = status;
    process();
  };
  this.then = function(scc, err) {
    success = scc || identity;
    error = err || identity;
    promise = new Promise();
    process();
    return promise;
  }
}

