describe("Promise", function() {
  var expectNotToBeCalled, promise, callback;

  beforeEach(function() {
    promise = new Promise();
    expectNotToBeCalled = jasmine.createSpy("should not be called");
    callback = jasmine.createSpy("a callback");
  });

  afterEach(function() {
    expect(expectNotToBeCalled).not.toHaveBeenCalled();
  });

  it("runs the success callback when promise was resolved", function() {
    promise.then(callback, expectNotToBeCalled);

    promise.resolve("Hurray!");

    expect(callback).toHaveBeenCalledWith("Hurray!");
  });

  it("runs the error callback when promise was rejected", function() {
    promise.then(expectNotToBeCalled, callback);

    promise.reject("Oops!");

    expect(callback).toHaveBeenCalledWith("Oops!");
  });

  it("runs all success callback when all promises were resolved", function() {
    promise.then(
      function(status) { return "resolved: " + status; },
      expectNotToBeCalled
    ).then(callback, expectNotToBeCalled);

    promise.resolve("Hurray!");

    expect(callback).toHaveBeenCalledWith("resolved: Hurray!");
  });

  it("propagates the failure", function() {
    anotherCallback = jasmine.createSpy("another callback");
    promise.then(expectNotToBeCalled)
           .then(expectNotToBeCalled, callback)
           .then(expectNotToBeCalled, anotherCallback);


    promise.reject("Oops!");

    expect(callback).toHaveBeenCalledWith("Oops!");
    expect(anotherCallback).toHaveBeenCalledWith("Oops!");
  });
});
