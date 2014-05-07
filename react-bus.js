/* global define */
;(function () {
  "use strict";

  // a shim for bind
  if (typeof Function.prototype.bind !== "function") {
    Function.prototype.bind = function (bind) {
        var self = this;
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return self.apply(bind || null, args);
        };
    };
  }

  var ReactBus = function () {
    this.listeners = {};

    this.counts = {
      "_drop": 0, // convenient so we don't have to test against `undefined`
                  // to check whether we have dropped any events.
      "_all": 0
    };
  };

  ReactBus.prototype.emit = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length < 1) { return ; }
    var e = args.shift();

    // count every event, even though they might not have been caught.
    this.counts[e] = this.counts[e] ? this.counts[e] + 1 : 1;

    if (!this.listeners[e]) {
      // don't register a drop on "_drop" or "_all"
      if (e !== "_drop" && e !== "_all") {
        this.emit("_drop", e, args);
      }
    }

    var ls = this.listeners[e] || [];
    for (var i = 0; i < ls.length; i += 1) {
      if (typeof ls[i] === "function") {
        ls[i].apply(this, args);
      }
    }

    // register an "_all" event when the event is not "_all" or "_drop".
    if (e !== "_all" && e !== "_drop") {
      this.emit("_all", e, args);
    }
  };

  // partially applied function, good for DOM event handlers.
  ReactBus.prototype.handle = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return function (event) {
      this.emit.apply(this, args.concat([event]));
    }.bind(this);
  };

  ReactBus.prototype.on = function (e, fn) {
    if (this.listeners[e]) {
      // don't add duplicates.
      if (this.listeners[e].indexOf(fn) !== -1) { return ; }

      return this.listeners[e].push(fn);
    }

    this.listeners[e] = [fn];
  };

  // this is mainly used for testing.
  ReactBus.prototype.once = function (e, fn) {
    var stub = function () {
      fn.apply(this, arguments);
      this.off(e, stub);
    }.bind(this);

    this.on(e, stub);
  };

  ReactBus.prototype.off = function (e, fn) {
    if (!this.listeners[e]) { return ; }

    // if no function was passed, delete all event handlers of `e`.
    if (typeof fn === "undefined") {
      delete this.listeners[e];
      return ;
    }

    var ls = this.listeners[e];
    var newLs = [];

    // filter out `fn`, I don't use `delete` because it creates gaps.
    for (var i = 0; i < ls.length; i += 1) {
      if (ls[i] !== fn) {
        newLs.push(ls[i]);
      }
    }

    if (newLs.length > 0) {
      this.listeners[e] = newLs;
    } else {
      // if there are no handlers left just remove the entire entry.
      delete this.listeners[e];
    }
  };

  // use AMD, CommonJS or the global object to register ReactBus.
	if (typeof define === "function" && define.amd) {
		define(function () {
			return ReactBus;
		});
	} else if (typeof module === "object" && module.exports){
		module.exports = ReactBus;
	} else {
		this.ReactBus = ReactBus;
	}
}.call(this));
