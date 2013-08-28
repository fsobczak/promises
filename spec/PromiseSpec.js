var QAdapter = function() {
  var defer = Q.defer();
  this.promise = defer.promise;
  this.then = function(s, f) { return defer.promise.then(s, f); };
  this.reject = function(status) { return defer.reject(status); };
  this.resolve = function(status) { return defer.resolve(status); };
}

var implementations = {'Promise': Promise, 'jQuery Deferred': $.Deferred, 'q': QAdapter};
$.each(implementations, function(label, promiseImpl) {
  describe(label, function() {
    var expectNotToBeCalled, promise, callback, anotherCallback;

    function fake(name) {
      return jasmine.createSpy(name).andCallFake(function(value) {
        return value;
      });
    }

    beforeEach(function() {
      promise = new promiseImpl();
      expectNotToBeCalled = jasmine.createSpy("should not be called");
      callback = fake("a callback");
      anotherCallback = fake("another callback");
    });

    afterEach(function() {
      expect(expectNotToBeCalled).not.toHaveBeenCalled();
    });

    function expectToBeCalled(fun, val) {
      setTimeout(function() {
        expect(fun).toHaveBeenCalledWith(val);
      });
    }

    it("runs the success callback when promise was resolved", function() {
      promise.then(callback, expectNotToBeCalled);

      promise.resolve("Hurray!");

      expectToBeCalled(callback, "Hurray!");
    });

    it("runs the error callback when promise was rejected", function() {
      promise.then(expectNotToBeCalled, callback);

      promise.reject("Oops!");

      expectToBeCalled(callback, "Oops!");
    });

    it("allows binding a callback to already resolved promise", function() {
      promise.resolve("Hurray!");

      promise.then(callback, expectNotToBeCalled)

      expectToBeCalled(callback, "Hurray!")
    });

    it("allows binding an errback to already rejected promise", function() {
      promise.reject("Oops!");

      promise.then(expectNotToBeCalled, callback);

      expectToBeCalled(callback, "Oops!")
    });

    it("runs all success callback when all promises were resolved", function() {
      promise.then(
        function(status) { return "resolved: " + status; },
        expectNotToBeCalled).then(callback, expectNotToBeCalled);

      promise.resolve("Hurray!");

      expectToBeCalled(callback, "resolved: Hurray!");
    });

    it("propagates the failure", function() {
      promise.then(expectNotToBeCalled)
             .then(expectNotToBeCalled, callback)
             .then(expectNotToBeCalled, anotherCallback);


      promise.reject("Oops!");

      expectToBeCalled(callback, "Oops!");
      expectToBeCalled(anotherCallback, "Oops!");
    });

    it("propagates the success", function() {
      promise.then(callback)
             .then()
             .then(anotherCallback);


      promise.resolve("Hurray!");

      expectToBeCalled(callback, "Hurray!");
      expectToBeCalled(anotherCallback, "Hurray!");
    });
  });
});
