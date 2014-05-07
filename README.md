# react-bus

An event emitter designed for communication between react components.

[![browser support](https://ci.testling.com/olahol/react-bus.png)
](https://ci.testling.com/olahol/react-bus)

## Example

Trivial example showing the special events (_drop and _all) and the
partial application emitter `ReactBus.handle` (good for event handlers).

```js
var AppBus = new ReactBus();

AppBus.on("_drop", function (e, args) {
  console.log("events of type", e, "arent being handled");
});

AppBus.on("_all", function (e, args) {
  console.log(e, "with arguments", args.join(","))
});

var Button = React.createClass({
  render: function () {
    return React.DOM.button({ onClick: AppBus.handle("click") }, "Button");
  };
});
```

## Methods

### ReactBus.prototype.on(e, fn)

Call `fn` every time event `e` triggers.

* * *

### ReactBus.prototype.once(e, fn)

Call `fn` once when event `e` triggers.

* * *

### ReactBus.prototype.off(e, fn)

Stop `fn` from being called when event `e` triggers.

* * *

### ReactBus.prototype.off(e)

Remove all listeners from event `e`.

* * *

### ReactBus.prototype.emit(e, args...)

Trigger an event `e` passing arguments `args...` to listeners.

* * *

### ReactBus.prototype.handle(e, args...) = fn(event)

Return a function `fn` when called triggers event `e` with arguments
`args..., event`. Useful for DOM event handlers like `onClick`.

## Special events

### _all(e, [args])

All events except `_all` and `_drop` trigger this event with `e` as the
event and `[args]` as the arguments passed to the event `e`. Useful for
tracking events for analytics.

* * *

### _drop(e, [args])

Events that do not have any listeners trigger this event with `e` as the
event and `[args]` as the arguments passed to the event `e`. Useful for
debugging any missed events in the system.

## License

MIT
