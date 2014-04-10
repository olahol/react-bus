var test = require("tape");

var ReactBus = require("../react-bus");

test("once & emit & handle", function (t) {
  t.plan(3);

  var bus = new ReactBus();

  bus.once("test", function (n) {
    t.equal(n, 1);
  });

  bus.once("test", function (n) {
    t.equal(n, 1);
  });

  bus.emit("test", 1);

  bus.once("test", function (n, event) {
    t.equal(event, "event");
  });

  bus.handle("test", 2)("event");
});

test("drop", function (t) {
  t.plan(1);

  var bus = new ReactBus();

  bus.on("_drop", function (n) {
    t.equal(n, "test");
  });

  bus.emit("test", 1);
});

test("counts", function (t) {
  t.plan(2);

  var bus = new ReactBus();

  bus.emit("test");
  bus.emit("test");
  bus.emit("test");
  bus.emit("test");
  bus.emit("test");

  t.equal(bus.counts.test, 5);
  t.equal(bus.counts._drop, 5);
});

test("off", function (t) {
  t.plan(2);

  var bus = new ReactBus();

  bus.on("test", function () {
    t.fail("should not fire 1");
  });

  bus.once("test", function () {
    t.fail("should not fire 2");
  });

  bus.off("test");
  bus.emit("test");

  var fn = function () {
    t.fail("should not fire 3");
  };

  bus.on("test", fn);
  bus.off("test", fn);
  bus.emit("test");

  t.equal(bus.counts.test, 2);
  t.equal(bus.counts._drop, 2);
});

test("dups", function (t) {
  t.plan(3);

  var bus = new ReactBus();

  var fn = function (n) {
    t.equal(n, 1);
  };

  bus.on("test", fn);
  bus.on("test", fn);
  bus.emit("test", 1);
  t.equal(bus.counts.test, 1);
  t.equal(bus.counts._drop, 0);
});
